import { camelCaseObject } from '@edx/frontend-platform';

export function getTimeOffsetMillis(headerDate, requestTime, responseTime) {
  // Time offset computation should move down into the HttpClient wrapper to maintain a global time correction reference
  // Requires 'Access-Control-Expose-Headers: Date' on the server response per https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#access-control-expose-headers

  let timeOffsetMillis = 0;
  if (headerDate !== undefined) {
    const headerTime = Date.parse(headerDate);
    const roundTripMillis = requestTime - responseTime;
    const localTime = responseTime - (roundTripMillis / 2); // Roughly compensate for transit time
    timeOffsetMillis = headerTime - localTime;
  }

  return timeOffsetMillis;
}

export function normalizeMetadata(metadata) {
  const requestTime = Date.now();
  const responseTime = requestTime;
  const { data, headers } = metadata;
  return {
    accessExpiration: camelCaseObject(data.access_expiration),
    canShowUpgradeSock: data.can_show_upgrade_sock,
    contentTypeGatingEnabled: data.content_type_gating_enabled,
    courseGoals: camelCaseObject(data.course_goals),
    id: data.id,
    title: data.name,
    offer: camelCaseObject(data.offer),
    enrollmentStart: data.enrollment_start,
    enrollmentEnd: data.enrollment_end,
    end: data.end,
    start: data.start,
    enrollmentMode: data.enrollment.mode,
    isEnrolled: data.enrollment.is_active,
    license: data.license,
    userTimezone: data.user_timezone,
    showCalculator: data.show_calculator,
    notes: camelCaseObject(data.notes),
    marketingUrl: data.marketing_url,
    celebrations: camelCaseObject(data.celebrations),
    userHasPassingGrade: data.user_has_passing_grade,
    courseExitPageIsActive: data.course_exit_page_is_active,
    certificateData: camelCaseObject(data.certificate_data),
    entranceExamData: camelCaseObject(data.entrance_exam_data),
    timeOffsetMillis: getTimeOffsetMillis(headers && headers.date, requestTime, responseTime),
    verifyIdentityUrl: data.verify_identity_url,
    verificationStatus: data.verification_status,
    linkedinAddToProfileUrl: data.linkedin_add_to_profile_url,
    relatedPrograms: camelCaseObject(data.related_programs),
    userNeedsIntegritySignature: data.user_needs_integrity_signature,
    canAccessProctoredExams: data.can_access_proctored_exams,
    learningAssistantEnabled: data.learning_assistant_enabled,
  };
}

export const appendBrowserTimezoneToUrl = (url) => {
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const urlObject = new URL(url);
  if (browserTimezone) {
    urlObject.searchParams.append('browser_timezone', browserTimezone);
  }
  return urlObject.href;
};

export function normalizeSequenceMetadata(sequence) {
  return {
    sequence: {
      id: sequence.item_id,
      blockType: sequence.tag,
      unitIds: sequence.items.map(unit => unit.id),
      bannerText: sequence.banner_text,
      format: sequence.format,
      title: sequence.display_name,
      /*
            Example structure of gated_content when prerequisites exist:
            {
              prereq_id: 'id of the prereq section',
              prereq_url: 'unused by this frontend',
              prereq_section_name: 'Name of the prerequisite section',
              gated: true,
              gated_section_name: 'Name of this gated section',
            */
      gatedContent: camelCaseObject(sequence.gated_content),
      isTimeLimited: sequence.is_time_limited,
      isProctored: sequence.is_proctored,
      isHiddenAfterDue: sequence.is_hidden_after_due,
      // Position comes back from the server 1-indexed. Adjust here.
      activeUnitIndex: sequence.position ? sequence.position - 1 : 0,
      saveUnitPosition: sequence.save_position,
      showCompletion: sequence.show_completion,
      allowProctoringOptOut: sequence.allow_proctoring_opt_out,
    },
    units: sequence.items.map(unit => ({
      id: unit.id,
      sequenceId: sequence.item_id,
      bookmarked: unit.bookmarked,
      complete: unit.complete,
      title: unit.page_title,
      contentType: unit.type,
      graded: unit.graded,
      containsContentTypeGatedContent: unit.contains_content_type_gated_content,
    })),
  };
}

export function normalizeLearningSequencesData(learningSequencesData) {
  const models = {
    courses: {},
    sections: {},
    sequences: {},
  };

  const now = new Date();
  function isReleased(block) {
    // We check whether the backend marks this as accessible because staff users are granted access anyway.
    // Note that sections don't have the `accessible` field and will just be checking `effective_start`.
    return block.accessible || !block.effective_start || now >= Date.parse(block.effective_start);
  }

  // Sequences
  Object.entries(learningSequencesData.outline.sequences).forEach(([seqId, sequence]) => {
    if (!isReleased(sequence)) {
      return; // Don't let the learner see unreleased sequences
    }

    models.sequences[seqId] = {
      id: seqId,
      title: sequence.title,
    };
  });

  // Sections
  learningSequencesData.outline.sections.forEach(section => {
    // Filter out any ignored sequences (e.g. unreleased sequences)
    const availableSequenceIds = section.sequence_ids.filter(seqId => seqId in models.sequences);

    // If we are unreleased and already stripped out all our children, just don't show us at all.
    // (We check both release date and children because children will exist for an unreleased section even for staff,
    // so we still want to show this section.)
    if (!isReleased(section) && !availableSequenceIds.length) {
      return;
    }

    models.sections[section.id] = {
      id: section.id,
      title: section.title,
      sequenceIds: availableSequenceIds,
      courseId: learningSequencesData.course_key,
    };

    // Add back-references to this section for all child sequences.
    availableSequenceIds.forEach(childSeqId => {
      models.sequences[childSeqId].sectionId = section.id;
    });
  });

  // Course
  models.courses[learningSequencesData.course_key] = {
    id: learningSequencesData.course_key,
    title: learningSequencesData.title,
    sectionIds: Object.entries(models.sections).map(([sectionId]) => sectionId),

    // Scan through all the sequences and look for ones that aren't released yet.
    hasScheduledContent: Object.values(learningSequencesData.outline.sequences).some(seq => !isReleased(seq)),
  };

  return models;
}

/**
 * Tweak the metadata for consistency
 * @param metadata the data to normalize
 * @param rootSlug either 'courseware' or 'outline' depending on the context
 * @returns {Object} The normalized metadata
 */
export function normalizeCourseHomeCourseMetadata(metadata, rootSlug) {
  const data = camelCaseObject(metadata);
  return {
    ...data,
    tabs: data.tabs.map(tab => ({
      // The API uses "courseware" as a slug for both courseware and the outline tab.
      // If needed, we switch it to "outline" here for
      // use within the MFE to differentiate between course home and courseware.
      slug: tab.tabId === 'courseware' ? rootSlug : tab.tabId,
      title: tab.title,
      url: tab.url,
    })),
    isMasquerading: data.originalUserIsStaff && !data.isStaff,
  };
}

export function normalizeCourseSectionVerticalData(metadata) {
  const data = camelCaseObject(metadata);
  return {
    ...data,
    sequence: {
      id: data.subsectionLocation,
      title: data.xblock.displayName,
      unitIds: data.xblockInfo.ancestorInfo.ancestors[0].childInfo.children.map((item) => item.id),
    },
    units: data.xblockInfo.ancestorInfo.ancestors[0].childInfo.children.map((unit) => ({
      id: unit.id,
      sequenceId: data.subsectionLocation,
      bookmarked: unit.bookmarked,
      complete: unit.complete,
      title: unit.displayName,
      contentType: unit.type,
      graded: unit.graded,
      containsContentTypeGatedContent: unit.contains_content_type_gated_content,
    })),
  };
}

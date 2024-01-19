const useCourseUnitData = (unitData) => {
  const {
    hasChanges, published, visibilityState,
    editedOn, editedBy, publishedBy, publishedOn,
    releaseDateFrom, releaseDate, hasExplicitStaffLock,
    enableCopyPasteUnits, releasedToStudents,
  } = unitData;

  const locationId = unitData?.id.match(/block@(.+)$/)[1];
  const visibleToStaffOnly = visibilityState === 'staff_only';
  let title = 'Draft (never published)';
  let releaseLabel = 'RELEASE';

  if (visibilityState === 'staff_only') {
    title = 'Visible to staff only';
  } else if (visibilityState === 'live') {
    title = 'Published and live';
    releaseLabel = 'RELEASED';
    releaseLabel = 'RELEASED';
  } else if (visibilityState === 'ready') {
    releaseLabel = 'SCHEDULED';
  } else if (published) {
    title = hasChanges ? 'Draft (unpublished changes)' : 'Published (not yet released)';
  }

  if (visibilityState === 'live') {
    releaseLabel = 'RELEASED';
  } else if (visibilityState === 'ready') {
    releaseLabel = 'SCHEDULED';
  }

  return {
    title,
    published,
    releaseLabel,
    locationId,
    visibilityState,
    visibleToStaffOnly,
    editedOn,
    editedBy,
    publishedBy,
    publishedOn,
    releaseDateFrom,
    releaseDate,
    hasChanges,
    hasExplicitStaffLock,
    enableCopyPasteUnits,
    releasedToStudents,
  };
};

export default useCourseUnitData;

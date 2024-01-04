import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import {
  normalizeMetadata,
  appendBrowserTimezoneToUrl,
  normalizeSequenceMetadata,
  normalizeLearningSequencesData,
  normalizeCourseHomeCourseMetadata,
} from './utils';

const getApiBaseUrl = () => getConfig().STUDIO_BASE_URL;

export const getCourseUnitApiUrl = (itemId) => `${getApiBaseUrl()}/xblock/container/${itemId}`;

export const setCourseUnitApiUrl = (itemId) => `${getApiBaseUrl()}/xblock/${itemId}`;

/**
 * Get course unit.
 * @param {string} unitId
 * @returns {Promise<Object>}
 */
export async function getCourseUnit(unitId) {
  const { data } = await getAuthenticatedHttpClient()
    .get(getCourseUnitApiUrl(unitId));

  return camelCaseObject(data);
}

/**
 * Edit course unit.
 * @param {string} unitId
 * @param {string} displayName
 * @returns {Promise<Object>}
 */
export async function editUnitDisplayName(unitId, displayName) {
  const { data } = await getAuthenticatedHttpClient()
    .post(setCourseUnitApiUrl(unitId), {
      metadata: {
        display_name: displayName,
      },
    });

  return data;
}

/**
 * Retrieves metadata for a specific sequence.
 *
 * @param {string} sequenceId - The ID of the sequence.
 * @returns {Promise<Object>} A Promise that resolves to the normalized sequence metadata.
 */
export async function getSequenceMetadata(sequenceId) {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getConfig().LMS_BASE_URL}/api/courseware/sequence/${sequenceId}`, {});

  return normalizeSequenceMetadata(data);
}

/**
 * Retrieves the outline of learning sequences for a specific course.
 *
 * @param {string} courseId - The ID of the course.
 * @returns {Promise<Object>} A Promise that resolves to the normalized learning sequences outline data.
 */
export async function getLearningSequencesOutline(courseId) {
  const outlineUrl = new URL(`${getConfig().LMS_BASE_URL}/api/learning_sequences/v1/course_outline/${courseId}`);
  const { data } = await getAuthenticatedHttpClient().get(outlineUrl.href, {});

  return normalizeLearningSequencesData(data);
}

/**
 * Retrieves metadata for a specific course.
 *
 * @param {string} courseId - The ID of the course.
 * @returns {Promise<Object>} A Promise that resolves to the normalized course metadata.
 */
export async function getCourseMetadata(courseId) {
  let url = `${getConfig().LMS_BASE_URL}/api/courseware/course/${courseId}`;
  url = appendBrowserTimezoneToUrl(url);
  const metadata = await getAuthenticatedHttpClient().get(url);

  return normalizeMetadata(metadata);
}

/**
 * Retrieves metadata for a course's home page.
 *
 * @param {string} courseId - The ID of the course.
 * @param {string} rootSlug - The root slug for the course.
 * @returns {Promise<Object>} A Promise that resolves to the normalized course home page metadata.
 */
export async function getCourseHomeCourseMetadata(courseId, rootSlug) {
  let url = `${getConfig().LMS_BASE_URL}/api/course_home/course_metadata/${courseId}`;
  url = appendBrowserTimezoneToUrl(url);
  const { data } = await getAuthenticatedHttpClient().get(url);

  return normalizeCourseHomeCourseMetadata(data, rootSlug);
}

// const getSequenceHandlerUrl = (courseId, sequenceId) => `${getConfig().LMS_BASE_URL}/courses/${courseId}/xblock/${sequenceId}/handler`;

// export async function postSequencePosition(courseId, sequenceId, activeUnitIndex) {
//   const { data } = await getAuthenticatedHttpClient().post(
//     `${getSequenceHandlerUrl(courseId, sequenceId)}/goto_position`,
//     // Position is 1-indexed on the server and 0-indexed in this app. Adjust here.
//     { position: activeUnitIndex + 1 },
//   );
//   return data;
// }

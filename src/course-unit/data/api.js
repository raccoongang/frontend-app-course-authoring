// @ts-check
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import {
  normalizeLearningSequencesData,
  normalizeSequenceMetadata,
  normalizeMetadata,
  normalizeCourseHomeCourseMetadata,
  appendBrowserTimezoneToUrl,
} from './utils';

const getApiBaseUrl = () => getConfig().STUDIO_BASE_URL;

export const getCourseUnitApiUrl = (itemId) => `${getApiBaseUrl()}/xblock/container/${itemId}`;

export const getXBlockBaseApiUrl = (itemId) => `${getApiBaseUrl()}/xblock/${itemId}`;

export const getCourseSectionVerticalApiUrl = (itemId) => `${getApiBaseUrl()}/api/contentstore/v1/container_handler/${itemId}`;

/**
 * Get course unit.
 * @param {string} unitId
 * @returns {Promise<Object>}
 */
export async function getCourseUnitData(unitId) {
  const { data } = await getAuthenticatedHttpClient()
    .get(getCourseUnitApiUrl(unitId));

  return camelCaseObject(data);
}

/**
 * Edit course unit display name.
 * @param {string} unitId
 * @param {string} displayName
 * @returns {Promise<Object>}
 */
export async function editUnitDisplayName(unitId, displayName) {
  const { data } = await getAuthenticatedHttpClient()
    .post(getXBlockBaseApiUrl(unitId), {
      metadata: {
        display_name: displayName,
      },
    });

  return data;
}

export async function getSequenceMetadata(sequenceId) {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getConfig().LMS_BASE_URL}/api/courseware/sequence/${sequenceId}`, {});

  return normalizeSequenceMetadata(data);
}

/**
 * Get an object containing course section vertical data.
 * @param {string} unitId
 * @returns {Promise<Object>}
 */
export async function getCourseSectionVerticalData(unitId) {
  const { data } = await getAuthenticatedHttpClient()
    .get(getCourseSectionVerticalApiUrl(unitId));

  return camelCaseObject(data);
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

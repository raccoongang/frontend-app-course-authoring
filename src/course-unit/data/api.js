// @ts-check
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import {
  normalizeLearningSequencesData,
  normalizeSequenceMetadata,
  normalizeMetadata,
  normalizeCourseHomeCourseMetadata,
  appendBrowserTimezoneToUrl,
  normalizeCourseSectionVerticalData,
} from './utils';

const getStudioBaseUrl = () => getConfig().STUDIO_BASE_URL;
const getLmsBaseUrl = () => getConfig().LMS_BASE_URL;

export const getCourseUnitApiUrl = (itemId) => `${getStudioBaseUrl()}/xblock/container/${itemId}`;
export const getXBlockBaseApiUrl = (itemId) => `${getStudioBaseUrl()}/xblock/${itemId}`;
export const getXBlockBaseApiOriginalUrl = () => `${getStudioBaseUrl()}/xblock/`;
export const getCourseSectionVerticalApiUrl = (itemId) => `${getStudioBaseUrl()}/api/contentstore/v1/container_handler/${itemId}`;
// export const getSequenceMetadataApiUrl = (sequenceId) => `${getLmsBaseUrl()}/api/courseware/sequence/${sequenceId}`;
export const getLearningSequencesOutlineApiUrl = (courseId) => `${getLmsBaseUrl()}/api/learning_sequences/v1/course_outline/${courseId}`;
export const getCourseMetadataApiUrl = (courseId) => `${getLmsBaseUrl()}/api/courseware/course/${courseId}`;
export const getCourseHomeCourseMetadataApiUrl = (courseId) => `${getLmsBaseUrl()}/api/course_home/course_metadata/${courseId}`;

/**
 * Get course unit.
 * @param {string} unitId
 * @returns {Promise<Object>}
 */
export async function getCourseUnitData(unitId) {
  const { data } = await getAuthenticatedHttpClient()
    .get(getCourseUnitApiUrl(unitId));
  // console.log('GHGHGFHGHG', data);
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

export async function addNewUnit(unitId, displayName) {
  const { data } = await getAuthenticatedHttpClient()
    .post(getXBlockBaseApiOriginalUrl(), {
      parent_locator: 'block-v1:edX+DemoX+Demo_Course+type@sequential+block@edx_introduction',
      category: 'vertical',
      display_name: 'Unit22',
    });

  return data;
}

/**
 * Get sequence metadata for a given sequence ID.
 * @param {string} sequenceId - The ID of the sequence for which metadata is requested.
 * @returns {Promise<Object>} - A Promise that resolves to the normalized sequence metadata.
 */
// export async function getSequenceMetadata(sequenceId) {
//   const { data } = await getAuthenticatedHttpClient()
//     .get(getSequenceMetadataApiUrl(sequenceId), {});
//   // console.log('normalizeSequenceMetadata(data)', normalizeSequenceMetadata(data));
//   return normalizeSequenceMetadata(data);
// }

/**
 * Get an object containing course section vertical data.
 * @param {string} unitId
 * @returns {Promise<Object>}
 */
export async function getCourseSectionVerticalData(unitId) {
  const { data } = await getAuthenticatedHttpClient()
    .get(getCourseSectionVerticalApiUrl(unitId));
  // console.log('getCourseSectionVerticalData', normalizeCourseSectionVerticalData(data));

  return normalizeCourseSectionVerticalData(data);
}

/**
 * Retrieves the outline of learning sequences for a specific course.
 * @param {string} courseId - The ID of the course.
 * @returns {Promise<Object>} A Promise that resolves to the normalized learning sequences outline data.
 */
export async function getLearningSequencesOutline(courseId) {
  const outlineUrl = new URL(getLearningSequencesOutlineApiUrl(courseId));
  const { data } = await getAuthenticatedHttpClient().get(outlineUrl.href, {});

  return normalizeLearningSequencesData(data);
}

/**
 * Retrieves metadata for a specific course.
 * @param {string} courseId - The ID of the course.
 * @returns {Promise<Object>} A Promise that resolves to the normalized course metadata.
 */
export async function getCourseMetadata(courseId) {
  let courseMetadataApiUrl = getCourseMetadataApiUrl(courseId);
  courseMetadataApiUrl = appendBrowserTimezoneToUrl(courseMetadataApiUrl);
  const metadata = await getAuthenticatedHttpClient().get(courseMetadataApiUrl);

  return normalizeMetadata(metadata);
}

/**
 * Retrieves metadata for a course's home page.
 * @param {string} courseId - The ID of the course.
 * @param {string} rootSlug - The root slug for the course.
 * @returns {Promise<Object>} A Promise that resolves to the normalized course home page metadata.
 */
// export async function getCourseHomeCourseMetadata(courseId, rootSlug) {
//   let courseHomeCourseMetadataApiUrl = getCourseHomeCourseMetadataApiUrl(courseId);
//   courseHomeCourseMetadataApiUrl = appendBrowserTimezoneToUrl(courseHomeCourseMetadataApiUrl);
//   const { data } = await getAuthenticatedHttpClient().get(courseHomeCourseMetadataApiUrl);
//
//   return normalizeCourseHomeCourseMetadata(data, rootSlug);
// }
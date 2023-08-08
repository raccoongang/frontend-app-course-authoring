import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

const getApiBaseUrl = () => getConfig().STUDIO_BASE_URL;
export const getCourseOutlineIndexApiUrl = (courseId) => `${getApiBaseUrl()}/api/contentstore/v1/course_index/${courseId}`;
export const getCourseReindexApiUrl = (reindexLink) => `${getApiBaseUrl()}${reindexLink}`;

/**
 * Get course outline index.
 * @param {string} courseId
 * @returns {Promise<Object>}
 */
export async function getCourseOutlineIndex(courseId) {
  const { data } = await getAuthenticatedHttpClient()
    .get(getCourseOutlineIndexApiUrl(courseId));

  return camelCaseObject(data);
}

/**
 * Get reindex course
 * @param {string} reindexLink
 * @returns {Promise<Object>}
 */
export async function getReindexCourse(reindexLink) {
  const { data } = await getAuthenticatedHttpClient()
    .get(getCourseReindexApiUrl(reindexLink));

  return camelCaseObject(data);
}

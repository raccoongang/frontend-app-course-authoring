import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

const getApiBaseUrl = () => getConfig().STUDIO_BASE_URL;
export const getCourseOutlineIndexApiUrl = (courseId) => `${getApiBaseUrl()}/api/contentstore/v1/course_index/${courseId}`;

export const getCourseBestPracticesApiUrl = ({
  courseId,
  excludeGraded,
  all,
}) => `${getApiBaseUrl()}/api/courses/v1/quality/${courseId}/?exclude_graded=${excludeGraded}&all=${all}`;
export const getCourseLaunchApiUrl = ({
  courseId,
  gradedOnly,
  validateOras,
  all,
}) => `${getApiBaseUrl()}/api/courses/v1/validation/${courseId}/?graded_only=${gradedOnly}&validate_oras=${validateOras}&all=${all}`;

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

export async function getCourseBestPractices({
  courseId,
  excludeGraded,
  all,
}) {
  const { data } = await getAuthenticatedHttpClient()
    .get(getCourseBestPracticesApiUrl({ courseId, excludeGraded, all }));

  return data;
}

export async function getCourseLaunch({
  courseId,
  gradedOnly,
  validateOras,
  all,
}) {
  const { data } = await getAuthenticatedHttpClient()
    .get(getCourseLaunchApiUrl({
      courseId, gradedOnly, validateOras, all,
    }));

  return data;
}

/* eslint-disable import/prefer-default-export */
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { convertObjectToSnakeCase } from '../../utils';

const getApiBaseUrl = () => getConfig().STUDIO_BASE_URL;
const getCourseAdvancedSettingsApiUrl = () => `${getApiBaseUrl()}/api/contentstore/v0/advanced_settings/`;
const getGradingSettingsApiUrl = () => `${getApiBaseUrl()}/api/contentstore/v1/course_grading/`;
// const getProctoringErrorsApiUrl = () => `${getApiBaseUrl()}/api/contentstore/v1/proctoring_errors/`;

/**
 * Get's advanced setting for a course.
 * @param {string} courseId
 * @returns {Promise<Object>}
 */
export async function getCourseAdvancedSettings(courseId) {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getCourseAdvancedSettingsApiUrl()}${courseId}?fetch_all=0`);
  return camelCaseObject(data);
}

/**
 * Get's grading setting for a course.
 * @param {string} courseId
 * @returns {Promise<Object>}
 */
export async function getGradingSettings(courseId) {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getGradingSettingsApiUrl()}${courseId}`);
  return camelCaseObject(data);
}

/**
 * Updates advanced setting for a course.
 * @param {string} courseId
 * @param {object} settings
 * @returns {Promise<Object>}
 */
export async function updateCourseAdvancedSettings(courseId, settings) {
  const { data } = await getAuthenticatedHttpClient()
    .patch(`${getCourseAdvancedSettingsApiUrl()}${courseId}`, convertObjectToSnakeCase(settings));
  return camelCaseObject(data);
}

// /**
//  * Gets proctoring exam errors.
//  * @param {string} courseId
//  * @returns {Promise<Object>}
//  */
// export async function getProctoringExamErrors(courseId) {
//   const { data } = await getAuthenticatedHttpClient().get(`${getProctoringErrorsApiUrl()}${courseId}`);
//   return camelCaseObject(data);
// }

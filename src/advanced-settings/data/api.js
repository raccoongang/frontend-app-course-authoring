/* eslint-disable import/prefer-default-export */
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { convertToSnakeCase } from '../../utils';

const getApiBaseUrl = () => getConfig().STUDIO_BASE_URL;
const getCourseAdvancedSettingsApiUrl = () => `${getApiBaseUrl()}/api/contentstore/v0/advanced_settings/course-v1:`;
const getProctoringErrorsApiUrl = () => `${getApiBaseUrl()}/api/contentstore/v1/proctoring_errors/course-v1:`;

/**
 * Get's advanced setting for a course.
 * @param {string} courseId
 * @param {[string]} settings
 * @returns {Promise<Object>}
 */
export async function getCourseAdvancedSettings(courseId) {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getCourseAdvancedSettingsApiUrl()}${courseId}?fetch_all=0`);
    return camelCaseObject(data);
}

/**
 * Update's advanced setting for a course.
 * @param {string} courseId
 * @param {string} setting
 * @returns {Promise<Object>}
 */
export async function updateCourseAdvancedSettings(courseId, settings) {
  const { data } = await getAuthenticatedHttpClient()
    .patch(`${getCourseAdvancedSettingsApiUrl()}${courseId}`, convertToSnakeCase(settings));
  return camelCaseObject(data);
}

/**
 * Get's proctoring exam errors.
 * @param {string} courseId
 * @returns {Promise<Object>}
 */
export async function getProctoringExamErrors(courseId) {
  const { data } = await getAuthenticatedHttpClient().get(`${getProctoringErrorsApiUrl()}${courseId}`);
  return camelCaseObject(data);
}

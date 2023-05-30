/* eslint-disable import/prefer-default-export */
import { snakeCase } from 'lodash/string';

import { camelCaseObject, ensureConfig, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

ensureConfig([
  'STUDIO_BASE_URL',
], 'Course Apps API service');

const getApiBaseUrl = () => getConfig().STUDIO_BASE_URL;
const getCourseAppsApiUrl = () => `${getApiBaseUrl()}/api/course_apps/v1/apps`;
const getCourseAdvancedSettingsApiUrl = () => `${getApiBaseUrl()}/api/contentstore/v0/advanced_settings`;
const getProctoringErrorsApiUrl = () => `${getApiBaseUrl()}/api/contentstore/v1/proctoring_errors`;

/**
 * Fetches the course apps installed for provided course
 * @param {string} courseId
 * @returns {Promise<[{}]>}
 */
export async function getCourseApps(courseId) {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getCourseAppsApiUrl()}${courseId}`);
  return camelCaseObject(data);
}

/**
 * Updates the status of a course app.
 * @param {string} courseId Course ID for the course to operate on
 * @param {string} appId ID for the application to operate on
 * @param {boolean} state The new state
 */
export async function updateCourseApp(courseId, appId, state) {
  await getAuthenticatedHttpClient()
    .patch(
      `${getCourseAppsApiUrl()}/${courseId}`,
      {
        id: appId,
        enabled: state,
      },
    );
}

/**
 * Get's advanced setting for a course.
 * @param {string} courseId
 * @param {[string]} settings
 * @returns {Promise<Object>}
 */
export async function getCourseAdvancedSettings(courseId) {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getCourseAdvancedSettingsApiUrl()}/course-v1:${courseId}?fetch_all=0`);
    // console.log('data GET', data);
    return camelCaseObject(data);
}

// function convertToSnakeCase(obj) {
//   return Object.keys(obj).reduce((snakeCaseObj, key) => {
//     const snakeCaseKey = snakeCase(key);
//     snakeCaseObj[snakeCaseKey] = { value: obj[key] };
//     return snakeCaseObj;
//   }, {});
// }

function convertToSnakeCase(obj) {
  return Object.keys(obj).reduce((snakeCaseObj, key) => {
    const snakeCaseKey = snakeCase(key);
    return {
      ...snakeCaseObj,
      [snakeCaseKey]: { value: obj[key] },
    };
  }, {});
}

/**
 * Get's advanced setting for a course.
 * @param {string} courseId
 * @param {string} setting
 * @param {*} value
 * @returns {Promise<Object>}
 */
export async function updateCourseAdvancedSettings(courseId, settings) {
  const { data } = await getAuthenticatedHttpClient()
    .patch(`${getCourseAdvancedSettingsApiUrl()}/course-v1:${courseId}`, convertToSnakeCase(settings));
  return camelCaseObject(data);
}

/**
 * Get's proctoring errors.
 * @param {string} courseId
 * @param {*} value
 * @returns {Promise<Object>}
 */
export async function getProctoringErrors(courseId) {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getProctoringErrorsApiUrl()}/course-v1:${courseId}`);
  return camelCaseObject(data);
}

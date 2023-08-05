import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { convertObjectToSnakeCase } from '../../utils';

const getApiBaseUrl = () => getConfig().STUDIO_BASE_URL;
export const getStudioHomeApiUrl = () => `${getApiBaseUrl()}/api/contentstore/v1/home`;

/**
 * Get's studio home data.
 * @returns {Promise<Object>}
 */
export async function getStudioHomeData() {
  const { data } = await getAuthenticatedHttpClient().get(getStudioHomeApiUrl());
  return camelCaseObject(data);
}

/**
 * Get's organizations data.
 * @returns {Promise<Object>}
 */
export async function getOrganizations() {
  const { data } = await getAuthenticatedHttpClient().get(`${getApiBaseUrl()}/organizations`);
  return camelCaseObject(data);
}

/**
 * Create a new course with data.
 * @param {object} data
 * @returns {Promise<Object>}
 */
export async function createNewCourse(newCourseData) {
  const { data } = await getAuthenticatedHttpClient().post(
    `${getApiBaseUrl()}/course/`,
    convertObjectToSnakeCase(newCourseData, true),
  );
  return camelCaseObject(data);
}

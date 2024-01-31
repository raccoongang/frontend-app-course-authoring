import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

const API_PATH_PATTERN = 'textbooks';
const getStudioBaseUrl = () => getConfig().STUDIO_BASE_URL;

export const getTextbooksApiUrl = (courseId) => `${getStudioBaseUrl()}/api/contentstore/v1/${API_PATH_PATTERN}/${courseId}`;

/**
 * Get textbooks for course.
 * @param {string} courseId
 * @returns {Promise<Object>}
 */
export async function getTextbooks(courseId) {
  const { data } = await getAuthenticatedHttpClient()
    .get(getTextbooksApiUrl(courseId));

  return camelCaseObject(data);
}

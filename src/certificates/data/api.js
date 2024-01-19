/* eslint-disable import/prefer-default-export */
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

const getApiBaseUrl = () => getConfig().STUDIO_BASE_URL;

export const getCertificatesApiUrl = (courseId) => `${getApiBaseUrl()}/api/contentstore/v1/certificates/${courseId}`;

/**
 * Gets certificates for a course.
 * @param {string} courseId
 * @returns {Promise<Object>}
 */
export async function getCertificates(courseId) {
  const { data } = await getAuthenticatedHttpClient()
    .get(getCertificatesApiUrl(courseId));
  return camelCaseObject(data);
}

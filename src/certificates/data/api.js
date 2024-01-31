/* eslint-disable import/prefer-default-export */
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { convertObjectToSnakeCase } from '../../utils';

const getApiBaseUrl = () => getConfig().STUDIO_BASE_URL;

export const getCertificatesApiUrl = (courseId) => `${getApiBaseUrl()}/api/contentstore/v1/certificates/${courseId}`;
export const getCertificateApiUrl = (courseId) => `${getApiBaseUrl()}/certificates/${courseId}`;
export const getDeleteCertificateApiUrl = (courseId, certificateId) => `${getApiBaseUrl()}/certificates/${courseId}/${certificateId}`;

/**
 * Gets certificates for a course.
 * @param {string} courseId
 * @returns {Promise<Object>}
 */
export async function getCertificates(courseId) {
  const { data } = await getAuthenticatedHttpClient().get(
    getCertificatesApiUrl(courseId),
  );
  return camelCaseObject(data);
}

/**
 * Create course certificate.
 * @param {string} courseId
 * @param {object} certificatesData
 * @returns {Promise<Object>}
 */
export async function createCertificate(courseId, certificatesData) {
  const { data } = await getAuthenticatedHttpClient().post(
    getCertificateApiUrl(courseId),
    convertObjectToSnakeCase(certificatesData, true),
  );
  return camelCaseObject(data);
}

/**
 * Delete course certificate.
 * @param {string} courseId
 * @param {object} certificateId
 * @returns {Promise<Object>}
 */
export async function deleteCertificate(courseId, certificateId) {
  const { data } = await getAuthenticatedHttpClient().delete(
    getDeleteCertificateApiUrl(courseId, certificateId),
  );
  return data;
}

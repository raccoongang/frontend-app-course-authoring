/* eslint-disable import/prefer-default-export */
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

const getApiBaseUrl = () => getConfig().STUDIO_BASE_URL;
export const postExportCourseApiUrl = (courseId) => `${getApiBaseUrl()}/export/${courseId}`;
const getExportStatusApiUrl = (courseId) => `${getApiBaseUrl()}/export_status/${courseId}`;

export async function startCourseExporting(courseId) {
  const { data } = await getAuthenticatedHttpClient()
    .post(`${postExportCourseApiUrl(courseId)}`);
  return camelCaseObject(data);
}

export async function getExportStatus(courseId) {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getExportStatusApiUrl(courseId)}`);
  return camelCaseObject(data);
}

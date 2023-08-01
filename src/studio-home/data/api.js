import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

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

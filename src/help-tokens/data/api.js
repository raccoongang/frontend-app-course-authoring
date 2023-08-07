/* eslint-disable import/prefer-default-export */
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

export async function getHelpTokens() {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getConfig().STUDIO_BASE_URL}/api/contentstore/v1/help_tokens`);
  return camelCaseObject(data);
}

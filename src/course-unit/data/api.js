// @ts-check
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

const getApiBaseUrl = () => getConfig().STUDIO_BASE_URL;

/**
 * Get course unit API url
 * @param {string} itemId
 * @returns {`${string}/xblock/container/${string}`}
 */
export const getCourseUnitApiUrl = (itemId) => `${getApiBaseUrl()}/xblock/container/${itemId}`;

/**
 * Get XBlock base API url
 * @param {string} itemId
 * @returns {`${string}/xblock/${string}`}
 */
export const getXBlockBaseApiUrl = (itemId) => `${getApiBaseUrl()}/xblock/${itemId}`;

/**
 * Get course unit.
 * @param {string} unitId
 * @returns {Promise<Object>}
 */
export async function getCourseUnit(unitId) {
  const { data } = await getAuthenticatedHttpClient()
    .get(getCourseUnitApiUrl(unitId));

  return camelCaseObject(data);
}

/**
 * Edit course unit.
 * @param {string} unitId
 * @param {string} displayName
 * @returns {Promise<Object>}
 */
export async function editUnitDisplayName(unitId, displayName) {
  const { data } = await getAuthenticatedHttpClient()
    .post(getXBlockBaseApiUrl(unitId), {
      metadata: {
        display_name: displayName,
      },
    });

  return data;
}

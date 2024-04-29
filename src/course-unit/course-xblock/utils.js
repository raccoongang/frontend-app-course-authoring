import { getConfig } from '@edx/frontend-platform';

import { STYLE_TAG_PATTERN } from './constants';

/**
 * Extracts content of <style> tags from the given HTML string.
 * @param {string} htmlString - The HTML string to extract styles from.
 * @returns {string[]} An array containing the content of <style> tags.
 */
export function extractStylesWithContent(htmlString) {
  const matches = [];
  let match = STYLE_TAG_PATTERN.exec(htmlString);

  while (match !== null) {
    matches.push(match[1]); // Pushing content of <style> tag
    match = STYLE_TAG_PATTERN.exec(htmlString);
  }

  return matches;
}

/**
 * Retrieves the base path for XBlock actions.
 * @param {string} xblockId - The ID of the XBlock.
 * @returns {string} The base path for XBlock actions.
 */
export function getXBlockActionsBasePath(xblockId) {
  return `${getConfig().STUDIO_BASE_URL}/xblock/${xblockId}/actions`;
}

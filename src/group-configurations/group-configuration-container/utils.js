import messages from './messages';

/**
 * Formats the given URL to a unit page URL.
 * @param {string} url - The original part of URL.
 * @param {string} courseId - The ID of the course.
 * @returns {string} - The formatted unit page URL.
 */
const formatUrlToUnitPage = (url, courseId) => `/course/${courseId}${url}`;

/**
 * Retrieves a list of group count based on the number of items.
 * @param {Array} items - The array of items to count.
 * @param {function} formatMessage - The function for formatting localized messages.
 * @returns {Array} - List of group count.
 */
const getGroupsCount = (items, formatMessage) => {
  if (items?.length) {
    const message = items.length === 1
      ? formatMessage(messages.containsGroup, { len: items.length })
      : formatMessage(messages.containsGroups, { len: items.length });

    return [message];
  }

  return [];
};

/**
 * Retrieves a list of usage count based on the number of items.
 * @param {Array} items - The array of items to count.
 * @param {function} formatMessage - The function for formatting localized messages.
 * @returns {Array} - List of usage count.
 */
const getUsageCount = (items, formatMessage) => {
  if (items?.length) {
    const message = items.length === 1
      ? formatMessage(messages.usedInLocation)
      : formatMessage(messages.usedInLocations, { len: items.length });

    return [message];
  }

  return [formatMessage(messages.notInUse)];
};

/**
 * Retrieves a combined list of badge messages based on usage and group information.
 * @param {Array} usage - The array of items indicating usage.
 * @param {Object} group - The group information.
 * @param {boolean} isExperiment - Flag indicating whether it is an experiment group configurations.
 * @param {function} formatMessage - The function for formatting localized messages.
 * @returns {Array} - Combined list of badges.
 */
const getCombinedBadgeList = (usage, group, isExperiment, formatMessage) => [
  ...(isExperiment ? getGroupsCount(group.groups, formatMessage) : []),
  ...getUsageCount(usage, formatMessage),
];

// eslint-disable-next-line import/prefer-default-export
export { formatUrlToUnitPage, getCombinedBadgeList };

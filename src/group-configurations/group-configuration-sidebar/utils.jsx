/**
 * Generates data for the enrollment track group sidebar section.
 *
 * @param {Object} messages - The localized messages.
 * @param {Object} intl - The intl object for formatting messages.
 * @returns {Object} The enrollment track group sidebar data.
 */
const getEnrollmentTrackGroup = ({ messages, intl }) => ({
  urlKey: 'enrollmentTracks',
  title: intl.formatMessage(messages.about_3_Title),
  paragraphs: [
    intl.formatMessage(messages.about_3_Description_1),
    intl.formatMessage(messages.about_3_Description_2),
    intl.formatMessage(messages.about_3_Description_3),
  ],
});

/**
 * Generates data for the content group sidebar section.
 *
 * @param {Object} messages - The localized messages.
 * @param {Object} intl - The intl object for formatting messages.
 * @returns {Object} The content group sidebar data.
 */
const getContentGroup = ({ messages, intl }) => ({
  urlKey: 'contentGroups',
  title: intl.formatMessage(messages.aboutTitle),
  paragraphs: [
    intl.formatMessage(messages.aboutDescription_1),
    intl.formatMessage(messages.aboutDescription_2),
    intl.formatMessage(
      messages.aboutDescription_3,
      {
        strongText: <strong>{intl.formatMessage(messages.aboutDescription_3_strong)}</strong>,
        strongText2: <strong>{intl.formatMessage(messages.aboutDescription_strong_edit)}</strong>,
      },
    ),
  ],
});

/**
 * Generates data for the experiment group configuration sidebar section.
 *
 * @param {Object} messages - The localized messages.
 * @param {Object} intl - The intl object for formatting messages.
 * @returns {Object} The experiment group configuration sidebar data.
 */
const getExperimentGroupConfiguration = ({ messages, intl }) => ({
  urlKey: 'groupConfigurations',
  title: intl.formatMessage(messages.about_2_Title),
  paragraphs: [
    intl.formatMessage(messages.about_2_Description_1),
    intl.formatMessage(
      messages.about_2_Description_2,
      {
        strongText: <strong>{intl.formatMessage(messages.about_2_Description_2_strong)}</strong>,
        strongText2: <strong>{intl.formatMessage(messages.aboutDescription_strong_edit)}</strong>,
      },
    ),
  ],
});

/**
 * Compiles the sidebar data for the course authoring sidebar.
 *
 * @param {Object} messages - The localized messages.
 * @param {Object} intl - The intl object for formatting messages.
 * @param {boolean} shouldShowExperimentGroups - Flag to include experiment group configuration data.
 * @param {boolean} shouldShowContentGroup - Flag to include content group data.
 * @param {boolean} shouldShowEnrollmentTrackGroup - Flag to include enrollment track group data.
 * @returns {Object[]} The array of sidebar data groups.
 */
// eslint-disable-next-line import/prefer-default-export
export const getSidebarData = ({
  messages, intl, shouldShowExperimentGroups, shouldShowContentGroup, shouldShowEnrollmentTrackGroup,
}) => {
  const groups = [];

  if (shouldShowEnrollmentTrackGroup) {
    groups.push(getEnrollmentTrackGroup({ messages, intl }));
  }

  if (shouldShowContentGroup) {
    groups.push(getContentGroup({ messages, intl }));
  }

  if (shouldShowExperimentGroups) {
    groups.push(getExperimentGroupConfiguration({ messages, intl }));
  }

  return groups;
};

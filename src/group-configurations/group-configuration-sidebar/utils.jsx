const getEnrollmentTrackGroup = ({ messages, intl }) => ({
  urlKey: 'enrollmentTracks',
  title: intl.formatMessage(messages.about_3_Title),
  paragraphs: [
    intl.formatMessage(messages.about_3_Description_1),
    intl.formatMessage(messages.about_3_Description_2),
    intl.formatMessage(messages.about_3_Description_3),
  ],
});

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

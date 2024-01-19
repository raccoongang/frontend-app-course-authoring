// eslint-disable-next-line import/prefer-default-export
export const getSidebarData = ({ messages, intl }) => [
  {
    title: intl.formatMessage(messages.about),
    paragraphs: [
      intl.formatMessage(messages.aboutDescription_1),
      intl.formatMessage(
        messages.aboutDescription_2,
        { strongText: <strong>{intl.formatMessage(messages.aboutDescription_2_strong)}</strong> },
      ),
      intl.formatMessage(
        messages.aboutDescription_3,
        { strongText: <strong>{intl.formatMessage(messages.aboutDescription_3_strong)}</strong> },
      ),
    ],
  },
  {
    title: intl.formatMessage(messages.about_2),
    paragraphs: [
      intl.formatMessage(
        messages.about_2_Description_1,
        { strongText: <strong>{intl.formatMessage(messages.about_2_Description_1_strong)}</strong> },
      ),
      intl.formatMessage(
        messages.about_2_Description_2,
        { strongText: <strong>{intl.formatMessage(messages.about_2_Description_2_strong)}</strong> },
      ),
    ],
  },
];

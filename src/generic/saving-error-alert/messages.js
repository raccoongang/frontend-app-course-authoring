import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  warningTitle: {
    id: 'course-authoring.generic.saving-error-alert.title',
    defaultMessage: 'Studio\'s having trouble saving your work',
  },
  warningDescription: {
    id: 'course-authoring.generic.saving-error-alert.description',
    defaultMessage: 'This may be happening because of an error with our server or your internet connection. Try refreshing the page or making sure you are online.',
  },
  warningTitleAriaLabelledBy: {
    id: 'course-authoring.generic.saving-error-alert.title.aria.labelled-by',
    defaultMessage: 'saving-error-alert-title',
  },
  warningDescriptionAriaDescribedBy: {
    id: 'course-authoring.generic.saving-error-alert.aria.described-by',
    defaultMessage: 'saving-error-alert-description',
  },
});

export default messages;

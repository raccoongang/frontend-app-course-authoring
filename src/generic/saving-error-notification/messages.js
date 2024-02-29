import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  warningTitle: {
    id: 'course-authoring.generic.saving-error-notification.title',
    defaultMessage: 'Studio\'s having trouble saving your work',
  },
  warningDescription: {
    id: 'course-authoring.generic.saving-error-notification.description',
    defaultMessage: 'This may be happening because of an error with our server or your internet connection. Try refreshing the page or making sure you are online.',
  },
  warningTitleAriaLabelledBy: {
    id: 'course-authoring.generic.saving-error-notification.title.aria.labelled-by',
    defaultMessage: 'saving-error-notification-title',
  },
  warningDescriptionAriaDescribedBy: {
    id: 'course-authoring.generic.saving-error-notification.aria.described-by',
    defaultMessage: 'saving-error-notification-description',
  },
});

export default messages;

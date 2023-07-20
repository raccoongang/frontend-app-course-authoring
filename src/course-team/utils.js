import { MODAL_TYPES } from './enum';
import messages from './info-modal/messages';

const getErrorEmailFromMessage = (message) => {
  const regex = /'([^']+)'/g;
  return message.match(regex)[0];
};

const getInfoModalSettings = (modalType, currentEmail, errorEmail, courseName, intl) => {
  switch (modalType) {
  case MODAL_TYPES.delete:
    return {
      title: intl.formatMessage(messages.deleteModalTitle),
      message: intl.formatMessage(messages.deleteModalMessage, { email: currentEmail, courseName }),
      variant: 'danger',
      closeButtonText: intl.formatMessage(messages.deleteModalCancelButton),
      submitButtonText: intl.formatMessage(messages.deleteModalDeleteButton),
      closeButtonVariant: 'tertiary',
    };
  case MODAL_TYPES.error:
    return {
      title: intl.formatMessage(messages.errorModalTitle),
      message: intl.formatMessage(messages.errorModalMessage, { errorEmail }),
      variant: 'danger',
      closeButtonText: intl.formatMessage(messages.errorModalOkButton),
      closeButtonVariant: 'danger',
    };
  case MODAL_TYPES.warning:
    return {
      title: intl.formatMessage(messages.warningModalTitle),
      message: intl.formatMessage(messages.warningModalMessage, { email: currentEmail, courseName }),
      variant: 'warning',
      closeButtonText: intl.formatMessage(messages.warningModalReturnButton),
      mainButtonVariant: 'primary',
    };
  default:
    return '';
  }
};

export {
  getErrorEmailFromMessage,
  getInfoModalSettings,
};

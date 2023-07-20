import React from 'react';
import PropTypes from 'prop-types';
import {
  ActionRow,
  Button,
  AlertModal,
} from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import { MODAL_TYPES } from '../enum';
import { getInfoModalSettings } from '../utils';

const InfoModal = ({
  modalType,
  isOpen,
  close,
  onDeleteSubmit,
  currentEmail,
  errorEmail,
  courseName,
}) => {
  const intl = useIntl();

  const {
    title,
    message,
    variant,
    closeButtonText,
    submitButtonText,
    closeButtonVariant,
  } = getInfoModalSettings(modalType, currentEmail, errorEmail, courseName, intl);

  return (
    <AlertModal
      title={title}
      variant={variant}
      isOpen={isOpen}
      onClose={close}
      footerNode={(
        <ActionRow>
          <Button variant={closeButtonVariant} onClick={close}>
            {closeButtonText}
          </Button>
          {modalType === MODAL_TYPES.delete ? (
            <Button
              variant="danger"
              onClick={(e) => {
                e.preventDefault();
                onDeleteSubmit();
              }}
            >
              {submitButtonText}
            </Button>
          ) : null}
        </ActionRow>
      )}
    >
      <p>{message}</p>
    </AlertModal>
  );
};

InfoModal.propTypes = {
  modalType: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  currentEmail: PropTypes.string.isRequired,
  errorEmail: PropTypes.string.isRequired,
  courseName: PropTypes.string.isRequired,
  onDeleteSubmit: PropTypes.func.isRequired,
};

export default InfoModal;

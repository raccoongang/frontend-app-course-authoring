import React from 'react';
import PropTypes from 'prop-types';
import { ActionRow, AlertModal, Button } from '@edx/paragon';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';

const ModalError = ({
  intl, isOpen, title, message, handleCancel, handleAction, cancelButtonText, actionButtonText,
}) => (
  <AlertModal
    title={title}
    isOpen={isOpen}
    variant="danger"
    footerNode={(
      <ActionRow>
        <Button variant="tertiary" onClick={handleCancel}>{cancelButtonText}</Button>
        <Button onClick={handleAction}>{actionButtonText}</Button>
      </ActionRow>
    )}
  >
    <p>{message}</p>
  </AlertModal>
);

ModalError.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(ModalError);

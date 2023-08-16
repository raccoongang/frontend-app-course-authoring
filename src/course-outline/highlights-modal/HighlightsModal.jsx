import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  ModalDialog, Button, ActionRow, Hyperlink,
} from '@edx/paragon';
import { Formik } from 'formik';

import FormikControl from '../../generic/FormikControl';
import { getHighlightsFormValues } from '../utils';
import messages from './messages';

const HighlightsModal = ({
  isOpen,
  onClose,
  onSubmit,
  currentHighlights,
}) => {
  const intl = useIntl();
  const initialFormValues = getHighlightsFormValues(currentHighlights);

  return (
    <ModalDialog
      className="highlights-modal"
      title="My dialog"
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      hasCloseButton
      isFullscreenOnMobile
    >
      <ModalDialog.Header className="highlights-modal__header">
        <ModalDialog.Title>{intl.formatMessage(messages.title)}</ModalDialog.Title>
      </ModalDialog.Header>
      <Formik initialValues={initialFormValues} onSubmit={onSubmit}>
        {({ values, dirty, handleSubmit }) => (
          <>
            <ModalDialog.Body>
              <p className="mb-4.5 pb-2">
                {intl.formatMessage(messages.description, {
                  // TODO add link when help token will merged
                  documentation: <Hyperlink destination="">{intl.formatMessage(messages.documentationLink)}</Hyperlink>,
                })}
              </p>
              {Object.entries(initialFormValues).map(([key]) => (
                <FormikControl
                  key={key}
                  name={key}
                  value={values[key]}
                  floatingLabel={intl.formatMessage(messages[key])}
                  maxLength={250}
                />
              ))}
            </ModalDialog.Body>
            <ModalDialog.Footer>
              <ActionRow>
                <ModalDialog.CloseButton variant="tertiary">
                  {intl.formatMessage(messages.cancelButton)}
                </ModalDialog.CloseButton>
                <Button variant="primary" disabled={!dirty} onClick={handleSubmit}>
                  {intl.formatMessage(messages.saveButton)}
                </Button>
              </ActionRow>
            </ModalDialog.Footer>
          </>
        )}
      </Formik>
    </ModalDialog>
  );
};

HighlightsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  currentHighlights: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default HighlightsModal;

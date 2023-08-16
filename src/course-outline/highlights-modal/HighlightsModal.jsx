import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  ModalDialog,
  Button,
  ActionRow,
  Hyperlink,
} from '@edx/paragon';
import { Formik } from 'formik';

import FormikControl from '../../generic/FormikControl';
import { HIGHLIGHTS_FIELD_MAX_LENGTH } from '../constants';
import { getHighlightsFormValues } from '../utils';
import messages from './messages';

const HighlightsModal = ({
  isOpen,
  onClose,
  onSubmit,
  currentSection,
  learnMoreVisibilityUrl,
}) => {
  const intl = useIntl();
  const { highlights, displayName } = currentSection;
  const initialFormValues = getHighlightsFormValues(highlights || []);

  return (
    <ModalDialog
      className="highlights-modal"
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      hasCloseButton
      isFullscreenOnMobile
    >
      <ModalDialog.Header className="highlights-modal__header">
        <ModalDialog.Title>
          {intl.formatMessage(messages.title, {
            title: displayName,
          })}
        </ModalDialog.Title>
      </ModalDialog.Header>
      <Formik initialValues={initialFormValues} onSubmit={onSubmit}>
        {({ values, dirty, handleSubmit }) => (
          <>
            <ModalDialog.Body>
              <p className="mb-4.5 pb-2">
                {intl.formatMessage(messages.description, {
                  documentation: (
                    <Hyperlink destination={learnMoreVisibilityUrl} target="_blank" showLaunchIcon={false}>
                      {intl.formatMessage(messages.documentationLink)}
                    </Hyperlink>),
                })}
              </p>
              {Object.entries(initialFormValues).map(([key]) => (
                <FormikControl
                  key={key}
                  name={key}
                  value={values[key]}
                  floatingLabel={intl.formatMessage(messages[key])}
                  maxLength={HIGHLIGHTS_FIELD_MAX_LENGTH}
                />
              ))}
            </ModalDialog.Body>
            <ModalDialog.Footer className="pt-1">
              <ActionRow>
                <ModalDialog.CloseButton variant="tertiary">
                  {intl.formatMessage(messages.cancelButton)}
                </ModalDialog.CloseButton>
                <Button disabled={!dirty} onClick={handleSubmit}>
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
  currentSection: PropTypes.shape({
    highlights: PropTypes.arrayOf(PropTypes.string).isRequired,
    displayName: PropTypes.string.isRequired,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  learnMoreVisibilityUrl: PropTypes.string.isRequired,
};

export default HighlightsModal;

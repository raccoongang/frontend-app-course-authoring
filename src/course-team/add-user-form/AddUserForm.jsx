import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button,
  Form,
  ActionRow,
} from '@edx/paragon';

import { Formik } from 'formik';
import messages from './messages';
import FormikControl from '../../generic/FormikControl';

const AddUserForm = ({ onSubmit, onCancel }) => {
  const intl = useIntl();

  return (
    <div className="add-user-form" data-testid="add-user-form">
      <Formik
        initialValues={{ email: '' }}
        onSubmit={onSubmit}
        validateOnBlur
      >
        {({ handleSubmit, values }) => (
          <>
            <Form.Group size="sm" className="form-field">
              <h3 className="form-title">{intl.formatMessage(messages.formTitle)}</h3>
              <Form.Label size="sm" className="form-label">
                {intl.formatMessage(messages.formLabel)}
              </Form.Label>
              <FormikControl
                name="email"
                value={values.email}
                withErrorText={false}
                placeholder={messages.formPlaceholder.defaultMessage}
              />
              <Form.Control.Feedback className="form-helperText">
                {intl.formatMessage(messages.formHelperText)}
              </Form.Control.Feedback>
            </Form.Group>
            <ActionRow>
              <Button variant="tertiary" size="sm" onClick={onCancel}>
                {intl.formatMessage(messages.cancelButton)}
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={!values.email.length}
                type="submit"
              >
                {intl.formatMessage(messages.addUserButton)}
              </Button>
            </ActionRow>
          </>
        )}
      </Formik>
    </div>
  );
};

AddUserForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AddUserForm;

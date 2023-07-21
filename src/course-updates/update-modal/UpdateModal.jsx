import React from 'react';
import PropTypes from 'prop-types';
import {
  ActionRow,
  Button,
  Form,
  Icon,
  ModalDialog,
} from '@edx/paragon';
import DatePicker from 'react-datepicker/dist';
import { useIntl } from '@edx/frontend-platform/i18n';
import classNames from 'classnames';
import { Calendar, Error } from '@edx/paragon/icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import messages from './messages';
import { convertToStringFromDate, convertToDateFromString, isValidDate } from '../../utils';
import { DATE_FORMAT } from '../../constants';
import { requestTypes } from '../constants';
import { WysiwygEditor } from '../../generic/WysiwygEditor';

const courseUpdatesValidationSchema = (requestType) => (requestType === requestTypes.edit_handouts
  ? Yup.object().shape()
  : Yup.object().shape({
    id: Yup.number().required(),
    date: Yup.string().min(1).required(),
    content: Yup.string(),
  }));

const UpdateModal = ({
  isOpen,
  close,
  requestType,
  onSubmit,
  courseUpdatesInitialValues,
}) => {
  const intl = useIntl();
  const currentContent = requestType === requestTypes.edit_handouts
    ? courseUpdatesInitialValues.data
    : courseUpdatesInitialValues.content;

  // const [contentValue, setContentValue] = useState('');

  const modalTitle = (type) => {
    switch (type) {
    case requestTypes.add_new_update:
      return intl.formatMessage(messages.addNewUpdateTitle);
    case requestTypes.edit_handouts:
      return intl.formatMessage(messages.editHandoutsTitle);
    case requestTypes.edit_update:
      return intl.formatMessage(messages.editUpdateTitle);
    default:
      return '';
    }
  };

  return (
    <ModalDialog
      title="update-moda"
      isOpen={isOpen}
      onClose={close}
      size="lg"
      variant="success"
      hasCloseButton
      isFullscreenOnMobile
      data-testid="update-modal"
    >
      <ModalDialog.Header>
        <ModalDialog.Title>{modalTitle(requestType)}</ModalDialog.Title>
      </ModalDialog.Header>
      <Formik
        initialValues={courseUpdatesInitialValues}
        validationSchema={courseUpdatesValidationSchema(requestType)}
        validateOnBlur
        onSubmit={onSubmit}
      >
        {({
          values, handleSubmit, isValid, setFieldValue,
        }) => (
          <>
            <ModalDialog.Body>
              <div className="update-modal-body">
                {requestType !== requestTypes.edit_handouts ? (
                  <Form.Group className="mb-4 datepicker-field datepicker-custom">
                    <Form.Control.Feedback>{intl.formatMessage(messages.updateModalDate)}</Form.Control.Feedback>
                    <div className="position-relative">
                      <Icon
                        src={Calendar}
                        className="datepicker-custom-control-icon"
                        alt={intl.formatMessage(messages.updateModalCalendarAltText)}
                      />
                      <DatePicker
                        name="date"
                        selected={convertToDateFromString(values.date)}
                        dateFormat={DATE_FORMAT}
                        className={classNames('datepicker-custom-control', {
                          'datepicker-custom-control_isInvalid': !isValid,
                        })}
                        autoComplete="off"
                        selectsStart
                        showPopperArrow={false}
                        onChange={(value) => {
                          if (!isValidDate(value)) {
                            return;
                          }
                          setFieldValue('date', convertToStringFromDate(value));
                        }}
                      />
                    </div>
                    {!isValid ? (
                      <div className="datepicker-field-error">
                        <Icon src={Error} alt={intl.formatMessage(messages.updateModalErrorAltText)} />
                        <span className="message-error">{intl.formatMessage(messages.updateModalInValid)}</span>
                      </div>
                    ) : null}
                  </Form.Group>
                ) : null}
                <Form.Group className="m-0">
                  <WysiwygEditor
                    initialValue={currentContent}
                    name={requestType === requestTypes.edit_handouts ? 'data' : 'content'}
                    onChange={(value) => {
                      setFieldValue(requestType === requestTypes.edit_handouts ? 'data' : 'content', value);
                    }}
                  />
                </Form.Group>
              </div>
            </ModalDialog.Body>
            <ModalDialog.Footer>
              <ActionRow>
                <ModalDialog.CloseButton variant="tertiary" type="button">
                  Cancel
                </ModalDialog.CloseButton>
                <Button variant="primary" onClick={handleSubmit} type="submit">
                  {requestType === requestTypes.edit_handouts
                    ? intl.formatMessage(messages.saveButton)
                    : intl.formatMessage(messages.postButton)}
                </Button>
              </ActionRow>
            </ModalDialog.Footer>
          </>
        )}
      </Formik>
    </ModalDialog>
  );
};

UpdateModal.propTypes = {
  courseUpdatesInitialValues: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ])).isRequired,
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  requestType: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default UpdateModal;

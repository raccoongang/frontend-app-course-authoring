import React from 'react';
import PropTypes from 'prop-types';
import {
  ActionRow,
  Button,
  Form,
  Icon,
  ModalDialog,
} from '@edx/paragon';
import classNames from 'classnames';
import DatePicker from 'react-datepicker/dist';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Calendar as CalendarIcon, Error as ErrorIcon } from '@edx/paragon/icons';
import { Formik } from 'formik';

import {
  convertToStringFromDate,
  convertToDateFromString,
  isValidDate,
} from '../../utils';
import messages from './messages';
import { REQUEST_TYPES } from '../constants';
import { DATE_FORMAT } from '../../constants';
import { WysiwygEditor } from '../../generic/WysiwygEditor';
import { geUpdateModalSettings } from './utils';

const UpdateModal = ({
  isOpen,
  close,
  requestType,
  onSubmit,
  courseUpdatesInitialValues,
}) => {
  const intl = useIntl();

  const {
    currentContent,
    modalTitle,
    validationSchema,
    contentFieldName,
    submitButtonText,
  } = geUpdateModalSettings(requestType, courseUpdatesInitialValues, intl);

  return (
    <ModalDialog
      title="update-modal"
      isOpen={isOpen}
      onClose={close}
      size="lg"
      variant="success"
      hasCloseButton
      isFullscreenOnMobile
      data-testid="update-modal"
      isBlocking
    >
      <ModalDialog.Header>
        <ModalDialog.Title>{modalTitle}</ModalDialog.Title>
      </ModalDialog.Header>
      <Formik
        initialValues={courseUpdatesInitialValues}
        validationSchema={validationSchema}
        validateOnBlur
        onSubmit={onSubmit}
      >
        {({
          values, handleSubmit, isValid, setFieldValue,
        }) => (
          <>
            <ModalDialog.Body>
              <div className="update-modal-body">
                {(requestType !== REQUEST_TYPES.edit_handouts) && (
                  <Form.Group className="mb-4 datepicker-field datepicker-custom">
                    <Form.Control.Feedback>{intl.formatMessage(messages.updateModalDate)}</Form.Control.Feedback>
                    <div className="position-relative">
                      <Icon
                        src={CalendarIcon}
                        className="datepicker-custom-control-icon"
                        alt={intl.formatMessage(messages.updateModalCalendarAltText)}
                      />
                      <DatePicker
                        name="date"
                        data-testid="course-updates-datepicker"
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
                    {!isValid && (
                      <div className="datepicker-field-error">
                        <Icon src={ErrorIcon} alt={intl.formatMessage(messages.updateModalErrorAltText)} />
                        <span className="message-error">{intl.formatMessage(messages.updateModalInValid)}</span>
                      </div>
                    )}
                  </Form.Group>
                )}
                <Form.Group className="m-0">
                  <WysiwygEditor
                    initialValue={currentContent}
                    data-testid="course-updates-wisiwyg-editor"
                    name={contentFieldName}
                    minHeight={400}
                    onChange={(value) => {
                      setFieldValue(contentFieldName, value || '<p>&nbsp;</p>');
                    }}
                  />
                </Form.Group>
              </div>
            </ModalDialog.Body>
            <ModalDialog.Footer>
              <ActionRow>
                <ModalDialog.CloseButton variant="tertiary" type="button">
                  {intl.formatMessage(messages.cancelButton)}
                </ModalDialog.CloseButton>
                <Button variant="primary" onClick={handleSubmit} type="submit">
                  {submitButtonText}
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
  // eslint-disable-next-line react/forbid-prop-types
  courseUpdatesInitialValues: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  requestType: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default UpdateModal;

import React from 'react';
import PropTypes from 'prop-types';
import {
  ActionRow,
  Button,
  Form,
  Icon,
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
import { geUpdateFormSettings } from './utils';

const UpdateForm = ({
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
  } = geUpdateFormSettings(requestType, courseUpdatesInitialValues, intl);

  return (
    <div className="update-form">
      <h3 className="title h3">{modalTitle}</h3>
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
            <div className="update-modal-body">
              {(requestType !== REQUEST_TYPES.edit_handouts) && (
                <Form.Group className="mb-4 datepicker-field datepicker-custom">
                  <Form.Control.Feedback>{intl.formatMessage(messages.updateFormDate)}</Form.Control.Feedback>
                  <div className="position-relative">
                    <Icon
                      src={CalendarIcon}
                      className="datepicker-custom-control-icon"
                      alt={intl.formatMessage(messages.updateFormCalendarAltText)}
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
                      <Icon src={ErrorIcon} alt={intl.formatMessage(messages.updateFormErrorAltText)} />
                      <span className="message-error">{intl.formatMessage(messages.updateFormInValid)}</span>
                    </div>
                  )}
                </Form.Group>
              )}
              <Form.Group className="m-0 mb-3">
                <WysiwygEditor
                  initialValue={currentContent}
                  data-testid="course-updates-wisiwyg-editor"
                  name={contentFieldName}
                  minHeight={300}
                  onChange={(value) => {
                    setFieldValue(contentFieldName, value || '<p>&nbsp;</p>');
                  }}
                />
              </Form.Group>
            </div>
            <ActionRow>
              <Button variant="tertiary" type="button" onClick={close}>
                {intl.formatMessage(messages.cancelButton)}
              </Button>
              <Button variant="primary" onClick={handleSubmit} type="submit">
                {submitButtonText}
              </Button>
            </ActionRow>
          </>
        )}
      </Formik>
    </div>
  );
};

UpdateForm.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  courseUpdatesInitialValues: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired,
  requestType: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default UpdateForm;

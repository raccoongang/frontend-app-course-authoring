import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { Info as InfoIcon } from '@edx/paragon/icons';
import {
  Form,
  Button,
  ActionRow,
  StatefulButton,
  TransitionReplace,
} from '@edx/paragon';

import AlertMessage from '../../generic/alert-message';
import { STATEFUL_BUTTON_STATES } from '../../constants';
import { RequestStatus } from '../../data/constants';
import { updateNewCourseData, updatePostErrors } from '../data/slice';
import { getSavingStatus } from '../data/selectors';
import { useCreateNewCourse } from './hooks';
import messages from './messages';

const CreateNewCourse = ({ handleOnClickCancel, handleOnClickCreate }) => {
  const {
    intl,
    errors,
    values,
    postErrors,
    isFormFilled,
    isFormInvalid,
    organizations,
    showErrorBanner,
    dispatch,
    handleBlur,
    handleChange,
    hasErrorField,
    setFieldValue,
  } = useCreateNewCourse();
  const savingStatus = useSelector(getSavingStatus);

  const newCourseFields = [
    {
      label: intl.formatMessage(messages.courseDisplayNameLabel),
      helpText: intl.formatMessage(messages.courseDisplayNameHelpText),
      name: 'displayName',
      value: values.displayName,
      isDropdown: false,
      placeholder: intl.formatMessage(messages.courseDisplayNamePlaceholder),
    },
    {
      label: intl.formatMessage(messages.courseOrgLabel),
      helpText: intl.formatMessage(messages.courseOrgHelpText, {
        strong: (
          <strong>
            {intl.formatMessage(messages.courseOrgHelpTextStrong)}
          </strong>
        ),
      }),
      name: 'org',
      value: values.org,
      isDropdown: true,
      options: organizations,
      placeholder: intl.formatMessage(messages.courseOrgPlaceholder),
    },
    {
      label: intl.formatMessage(messages.courseNumberLabel),
      helpText: intl.formatMessage(messages.courseNumberHelpText, {
        strong: (
          <strong>
            {intl.formatMessage(messages.courseNumberHelpTextStrong)}
          </strong>
        ),
      }),
      name: 'number',
      value: values.number,
      isDropdown: false,
      placeholder: intl.formatMessage(messages.courseNumberPlaceholder),
    },
    {
      label: intl.formatMessage(messages.courseRunLabel),
      helpText: intl.formatMessage(messages.courseRunHelpText),
      name: 'run',
      value: values.run,
      isDropdown: false,
      placeholder: intl.formatMessage(messages.courseRunPlaceholder),
    },
  ];

  const onClickSave = () => {
    dispatch(updateNewCourseData(values));
    handleOnClickCreate();
  };

  const onClickCancel = () => {
    dispatch(updatePostErrors({}));
    handleOnClickCancel();
  };

  const createButtonState = {
    labels: {
      default: intl.formatMessage(messages.createButton),
      pending: intl.formatMessage(messages.creatingButton),
    },
    disabledStates: [STATEFUL_BUTTON_STATES.pending],
  };

  return (
    <div className="new-course-section mb-4.5">
      <TransitionReplace>
        {showErrorBanner ? (
          <AlertMessage
            variant="danger"
            icon={InfoIcon}
            title={postErrors.errMsg}
            aria-hidden="true"
            aria-labelledby={intl.formatMessage(messages.alertErrorExistsAriaLabelledBy)}
            aria-describedby={intl.formatMessage(messages.alertErrorExistsAriaDescribedBy)}
          />
        ) : null}
      </TransitionReplace>
      <h3 className="mb-3">{intl.formatMessage(messages.createNewCourse)}</h3>
      <Form>
        {newCourseFields.map((field) => (
          <Form.Group
            className={classNames('form-group-custom', {
              'form-group-custom_isInvalid': hasErrorField(field.name),
            })}
            key={field.label}
          >
            <Form.Label>{field.label}</Form.Label>
            {!field.isDropdown ? (
              <Form.Control
                value={values[field.name]}
                placeholder={field.placeholder}
                name={field.name}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={hasErrorField(field.name)}
              />
            ) : (
              <Form.Autosuggest
                value={values[field.name]}
                name={field.name}
                placeholder={field.placeholder}
                onChange={(value) => setFieldValue(field.name, value)}
                onSelected={(value) => setFieldValue(field.name, value)}
                onBlur={handleBlur}
                isInvalid={hasErrorField(field.name)}
              >
                {field.options.map((option) => (
                  <Form.AutosuggestOption key={option}>
                    {option}
                  </Form.AutosuggestOption>
                ))}
              </Form.Autosuggest>
            )}
            <Form.Text>{field.helpText}</Form.Text>
            {hasErrorField(field.name) && (
              <Form.Control.Feedback
                className="feedback-error"
                type="invalid"
                hasIcon={false}
              >
                <span className="x-small">{errors[field.name]}</span>
              </Form.Control.Feedback>
            )}
          </Form.Group>
        ))}
        <ActionRow className="justify-content-start">
          <Button variant="outline-primary" onClick={onClickCancel}>
            {intl.formatMessage(messages.cancelButton)}
          </Button>
          <StatefulButton
            key="save-button"
            className="ml-3"
            onClick={onClickSave}
            disabled={!isFormFilled || isFormInvalid}
            state={
              savingStatus === RequestStatus.IN_PROGRESS
                ? STATEFUL_BUTTON_STATES.pending
                : STATEFUL_BUTTON_STATES.default
            }
            {...createButtonState}
          />
        </ActionRow>
      </Form>
    </div>
  );
};

CreateNewCourse.propTypes = {
  handleOnClickCancel: PropTypes.func.isRequired,
  handleOnClickCreate: PropTypes.func.isRequired,
};

export default CreateNewCourse;

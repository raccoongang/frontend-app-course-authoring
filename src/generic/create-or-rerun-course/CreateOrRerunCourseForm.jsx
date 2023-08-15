import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import {
  Form, Button, ActionRow, StatefulButton, TransitionReplace,
} from '@edx/paragon';
import { Info as InfoIcon } from '@edx/paragon/icons';

import AlertMessage from '../alert-message';
import { STATEFUL_BUTTON_STATES } from '../../constants';
import { RequestStatus } from '../../data/constants';
import { getSavingStatus } from '../data/selectors';
import { updateCourseData, updatePostErrors } from '../data/slice';
import { useCreateOrRerunCourse } from './hooks';
import messages from './messages';

const CreateOrRerunCourseForm = ({
  title,
  isCreateNewCourse,
  initialValues,
  onClickCreate,
  onClickCancel,
}) => {
  const { courseId } = useParams();
  const savingStatus = useSelector(getSavingStatus);
  const runFieldReference = useRef(null);
  const displayNameFieldReference = useRef(null);

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
  } = useCreateOrRerunCourse(initialValues);

  const newCourseFields = [
    {
      label: intl.formatMessage(messages.courseDisplayNameLabel),
      helpText: intl.formatMessage(
        isCreateNewCourse
          ? messages.courseDisplayNameCreateHelpText
          : messages.courseDisplayNameRerunHelpText,
      ),
      name: 'displayName',
      value: values.displayName,
      isDropdown: false,
      placeholder: intl.formatMessage(messages.courseDisplayNamePlaceholder),
      disabled: false,
      ref: displayNameFieldReference,
    },
    {
      label: intl.formatMessage(messages.courseOrgLabel),
      helpText: isCreateNewCourse
        ? intl.formatMessage(messages.courseOrgCreateHelpText, {
          strong: <strong>{intl.formatMessage(messages.courseNoteOrgNameIsPartStrong)}</strong>,
        })
        : intl.formatMessage(messages.courseOrgRerunHelpText, {
          strong: (
            <>
              <br />
              <strong>
                {intl.formatMessage(messages.courseNoteNoSpaceAllowedStrong)}
              </strong>
            </>
          ),
        }),
      name: 'org',
      value: values.org,
      isDropdown: true,
      options: organizations,
      placeholder: intl.formatMessage(messages.courseOrgPlaceholder),
      disabled: false,
    },
    {
      label: intl.formatMessage(messages.courseNumberLabel),
      helpText: isCreateNewCourse
        ? intl.formatMessage(messages.courseNumberCreateHelpText, {
          strong: (
            <strong>
              {intl.formatMessage(messages.courseNotePartCourseURLRequireStrong)}
            </strong>
          ),
        })
        : intl.formatMessage(messages.courseNumberRerunHelpText),
      name: 'number',
      value: values.number,
      isDropdown: false,
      placeholder: intl.formatMessage(messages.courseNumberPlaceholder),
      disabled: !isCreateNewCourse,
    },
    {
      label: intl.formatMessage(messages.courseRunLabel),
      helpText: isCreateNewCourse
        ? intl.formatMessage(messages.courseRunCreateHelpText, {
          strong: (
            <strong>
              {intl.formatMessage(messages.courseNotePartCourseURLRequireStrong)}
            </strong>
          ),
        })
        : intl.formatMessage(messages.courseRunRerunHelpText, {
          strong: (
            <>
              <br />
              <strong>
                {intl.formatMessage(messages.courseNoteNoSpaceAllowedStrong)}
              </strong>
            </>
          ),
        }),
      name: 'run',
      value: values.run,
      isDropdown: false,
      placeholder: intl.formatMessage(messages.courseRunPlaceholder),
      disabled: false,
      ref: runFieldReference,
    },
  ];

  const createButtonState = {
    labels: {
      default: intl.formatMessage(isCreateNewCourse ? messages.createButton : messages.rerunCreateButton),
      pending: intl.formatMessage(isCreateNewCourse ? messages.creatingButton : messages.rerunningCreateButton),
    },
    disabledStates: [STATEFUL_BUTTON_STATES.pending],
  };

  const handleOnClickCreate = () => {
    const courseData = isCreateNewCourse ? values : { ...values, sourceCourseKey: courseId };
    dispatch(updateCourseData(courseData));
    onClickCreate();
  };

  const handleOnClickCancel = () => {
    dispatch(updatePostErrors({}));
    onClickCancel();
  };

  const handleCustomBlurForDropdown = (e) => {
    // it needs to correct handleOnChange Form.Autosuggest
    const { value, name } = e.target;
    setFieldValue(name, value);
    handleBlur(e);
  };

  useEffect(() => {
    // it needs to display the initial focus for the field depending on the current page
    if (!isCreateNewCourse) {
      runFieldReference?.current?.focus();
    } else {
      displayNameFieldReference?.current?.focus();
    }
  }, []);

  return (
    <div className="create-or-rerun-course-form">
      <TransitionReplace>
        {showErrorBanner ? (
          <AlertMessage
            variant="danger"
            icon={InfoIcon}
            title={postErrors.errMsg}
            aria-hidden="true"
            aria-labelledby={intl.formatMessage(
              messages.alertErrorExistsAriaLabelledBy,
            )}
            aria-describedby={intl.formatMessage(
              messages.alertErrorExistsAriaDescribedBy,
            )}
          />
        ) : null}
      </TransitionReplace>
      <h3 className="mb-3">{title}</h3>
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
                disabled={field.disabled}
                ref={field?.ref}
              />
            ) : (
              <Form.Autosuggest
                value={values[field.name]}
                name={field.name}
                placeholder={field.placeholder}
                onSelected={(value) => setFieldValue(field.name, value)}
                onBlur={handleCustomBlurForDropdown}
                isInvalid={hasErrorField(field.name)}
                key={uuid()}
              >
                {field?.options?.map((option) => (
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
          <Button
            variant="outline-primary"
            onClick={handleOnClickCancel}
          >
            {intl.formatMessage(messages.cancelButton)}
          </Button>
          <StatefulButton
            key="save-button"
            className="ml-3"
            onClick={handleOnClickCreate}
            disabled={!isFormFilled || isFormInvalid}
            state={
              savingStatus === RequestStatus.PENDING
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

CreateOrRerunCourseForm.defaultProps = {
  title: '',
  isCreateNewCourse: false,
};

CreateOrRerunCourseForm.propTypes = {
  title: PropTypes.string,
  initialValues: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    org: PropTypes.string.isRequired,
    number: PropTypes.string.isRequired,
    run: PropTypes.string.isRequired,
  }).isRequired,
  isCreateNewCourse: PropTypes.bool,
  onClickCreate: PropTypes.func.isRequired,
  onClickCancel: PropTypes.func.isRequired,
};

export default CreateOrRerunCourseForm;
import PropTypes from 'prop-types';
import { FieldArray, Formik } from 'formik';
import * as Yup from 'yup';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Alert,
  ActionRow,
  Button,
  Form,
  OverlayTrigger,
  Tooltip,
} from '@edx/paragon';
import { WarningFilled as WarningFilledIcon } from '@edx/paragon/icons';

import PromptIfDirty from '../../generic/PromptIfDirty';
import { allGroupNameAreUnique } from './utils';
import ExperimentFormGroups from './ExperimentFormGroups';
import messages from './messages';

const ExperimentForm = ({
  isEditMode,
  initialValues,
  isUsedInLocation,
  onCreateClick,
  onCancelClick,
  onDeleteClick,
  onEditClick,
}) => {
  const { formatMessage } = useIntl();

  const validationSchema = Yup.object().shape({
    id: Yup.number(),
    name: Yup.string().required(
      formatMessage(messages.experimentConfigurationNameRequired),
    ),
    description: Yup.string(),
    groups: Yup.array()
      .of(
        Yup.object().shape({
          id: Yup.number(),
          name: Yup.string().required(
            formatMessage(messages.experimentConfigurationGroupsNameRequired),
          ),
          version: Yup.number(),
          usage: Yup.array().nullable(true),
        }),
      )
      .required()
      .min(1, formatMessage(messages.experimentConfigurationGroupsRequired))
      .test(
        'unique-group-name-restriction',
        formatMessage(messages.experimentConfigurationGroupsNameUnique),
        (values) => allGroupNameAreUnique(values),
      ),
    scheme: Yup.string(),
    version: Yup.number(),
    parameters: Yup.object(),
    usage: Yup.array()
      .of(
        Yup.object().shape({
          label: Yup.string(),
          url: Yup.string(),
        }),
      )
      .nullable(true),
    active: Yup.bool(),
  });

  const onSubmitForm = isEditMode ? onEditClick : onCreateClick;

  return (
    <div
      className="configuration-card"
      data-testid="experiment-configuration-form"
    >
      <div className="configuration-card-header">
        <h3>{formatMessage(messages.experimentConfigurationName)}*</h3>
        {isEditMode && (
          <span className="text-gray-500">
            {formatMessage(messages.experimentConfigurationId, {
              id: initialValues.id,
            })}
          </span>
        )}
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={onSubmitForm}
      >
        {({
          values, errors, dirty, handleChange, handleSubmit,
        }) => (
          <>
            <Form.Group className="mt-3 form-group-configuration" isInvalid={!!errors.name}>
              <Form.Control
                value={values.name}
                name="name"
                onChange={handleChange}
                placeholder={formatMessage(
                  messages.experimentConfigurationNamePlaceholder,
                )}
              />
              <Form.Control.Feedback
                hasIcon={false}
                type="default"
              >
                {formatMessage(messages.experimentConfigurationNameFeedback)}
              </Form.Control.Feedback>
              {errors.name && (
                <Form.Control.Feedback
                  hasIcon={false}
                  type="invalid"
                >
                  {errors.name}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="form-group-configuration">
              <Form.Label>
                {formatMessage(messages.experimentConfigurationDescription)}
              </Form.Label>
              <Form.Control
                value={values.description}
                name="description"
                onChange={handleChange}
                placeholder={formatMessage(
                  messages.experimentConfigurationDescriptionPlaceholder,
                )}
              />
              <Form.Control.Feedback
                hasIcon={false}
                type="default"
              >
                {formatMessage(
                  messages.experimentConfigurationDescriptionFeedback,
                )}
              </Form.Control.Feedback>
            </Form.Group>

            <FieldArray
              name="groups"
              render={(arrayHelpers) => (
                <ExperimentFormGroups
                  groups={values.groups}
                  errors={errors.groups}
                  onChange={handleChange}
                  onDeleteGroup={(idx) => arrayHelpers.remove(idx)}
                  onCreateGroup={(newGroup) => arrayHelpers.push(newGroup)}
                />
              )}
            />

            {isUsedInLocation && (
              <Alert
                variant="warning"
                icon={WarningFilledIcon}
                className="my-3"
              >
                <p>{formatMessage(messages.experimentConfigurationAlert)}</p>
              </Alert>
            )}

            <ActionRow data-testid="experiment-configuration-actions">
              {isEditMode && (
                <OverlayTrigger
                  overlay={(
                    <Tooltip
                      id={`delete-restriction-tooltip-${values.newGroupName}`}
                    >
                      {formatMessage(
                        isUsedInLocation
                          ? messages.experimentConfigurationDeleteRestriction
                          : messages.actionDelete,
                      )}
                    </Tooltip>
                  )}
                >
                  <Button
                    disabled={isUsedInLocation}
                    variant="outline-primary"
                    onClick={onDeleteClick}
                  >
                    {formatMessage(messages.actionDelete)}
                  </Button>
                </OverlayTrigger>
              )}
              <ActionRow.Spacer />
              <Button onClick={onCancelClick} variant="tertiary">
                {formatMessage(messages.experimentConfigurationCancel)}
              </Button>
              <Button onClick={handleSubmit}>
                {formatMessage(
                  isEditMode
                    ? messages.experimentConfigurationSave
                    : messages.experimentConfigurationCreate,
                )}
              </Button>
            </ActionRow>
            <PromptIfDirty dirty={dirty} />
          </>
        )}
      </Formik>
    </div>
  );
};

ExperimentForm.defaultProps = {
  isEditMode: false,
  isUsedInLocation: false,
  onCreateClick: null,
  onDeleteClick: null,
  onEditClick: null,
};

ExperimentForm.propTypes = {
  isEditMode: PropTypes.bool,
  initialValues: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        groupName: PropTypes.string,
      }),
    ),
  }).isRequired,
  isUsedInLocation: PropTypes.bool,
  onCreateClick: PropTypes.func,
  onCancelClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func,
  onEditClick: PropTypes.func,
};

export default ExperimentForm;

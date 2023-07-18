import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Button } from '@edx/paragon';
import { CheckCircle, Warning } from '@edx/paragon/icons';

import AlertMessage from '../../generic/alert-message';
import { validationAssignmentFields } from './utils/validation';
import AssignmentItem from './assignments/AssignmentItem';
import AssignmentTypeName from './assignments/AssignmentTypeName';
import { defaultAssignmentsPropTypes, ASSIGNMENT_TYPES } from './utils/enum';
import messages from './messages';

const MIN_NUMBER_VALUE = 0;
const MAX_NUMBER_VALUE = 100;

const AssignmentSection = ({
  intl,
  handleRemoveAssignment,
  setShowSavePrompt,
  graders,
  setGradingData,
  courseAssignmentLists,
  setShowSuccessAlert,
}) => {
  const [errorList, setErrorList] = useState({});
  const {
    type, weight, minCount, dropCount,
  } = ASSIGNMENT_TYPES;

  const handleAssignmentChange = (e, assignmentId) => {
    const { name, value } = e.target;

    setShowSavePrompt(true);

    setGradingData(prevState => {
      const updatedState = prevState.graders.map(grader => {
        if (grader.id === assignmentId) {
          return { ...grader, [name]: value };
        }
        return grader;
      });

      return { ...prevState, graders: updatedState };
    });

    validationAssignmentFields(
      assignmentId,
      name,
      type,
      value,
      setErrorList,
      setShowSavePrompt,
      graders,
      weight,
      minCount,
      dropCount,
    );
    setShowSuccessAlert(false);
  };

  return (
    <div className="assignment-items">
      {graders?.map((gradeField, idx) => {
        const courseAssignmentUsage = courseAssignmentLists[gradeField.type.toLowerCase()];
        return (
          <div key={gradeField.id} className="course-grading-assignment-wrapper mb-4">
            <ol className="course-grading-assignment-items p-0 mb-4">
              <AssignmentTypeName
                value={gradeField.type}
                errorEffort={errorList[`${type}-${idx}`]}
                onChange={(e) => handleAssignmentChange(e, idx)}
              />
              <AssignmentItem
                className="course-grading-assignment-abbreviation"
                title={intl.formatMessage(messages.abbreviationTitle)}
                descriptions={intl.formatMessage(messages.abbreviationDescription)}
                type="text"
                name="shortLabel"
                value={gradeField.shortLabel}
                onChange={(e) => handleAssignmentChange(e, idx)}
              />
              <AssignmentItem
                className="course-grading-assignment-total-grade"
                title={intl.formatMessage(messages.weightOfTotalGradeTitle)}
                descriptions={intl.formatMessage(messages.weightOfTotalGradeDescription)}
                type="number"
                min={MIN_NUMBER_VALUE}
                max={MAX_NUMBER_VALUE}
                errorMsg={intl.formatMessage(messages.weightOfTotalGradeErrorMessage)}
                name={weight}
                value={gradeField.weight}
                onChange={(e) => handleAssignmentChange(e, idx)}
                errorEffort={errorList[`${weight}-${idx}`]}
              />
              <AssignmentItem
                className="course-grading-assignment-total-number"
                title={intl.formatMessage(messages.totalNumberTitle)}
                descriptions={intl.formatMessage(messages.totalNumberDescription)}
                type="number"
                min={1}
                errorMsg={intl.formatMessage(messages.totalNumberErrorMessage)}
                name={minCount}
                value={gradeField.minCount}
                onChange={(e) => handleAssignmentChange(e, idx)}
                errorEffort={errorList[`${minCount}-${idx}`]}
              />
              <AssignmentItem
                className="course-grading-assignment-number-droppable"
                title={intl.formatMessage(messages.numberOfDroppableTitle)}
                descriptions={intl.formatMessage(messages.numberOfDroppableDescription)}
                type="number"
                min={MIN_NUMBER_VALUE}
                errorMsg={intl.formatMessage(messages.numberOfDroppableErrorMessage)}
                name={dropCount}
                gradeField={gradeField}
                value={gradeField.dropCount}
                onChange={(e) => handleAssignmentChange(e, idx)}
                secondErrorMsg={(
                  <FormattedMessage
                    id="course-authoring.grading-settings.assignment.number-of-droppable.second.error.message"
                    defaultMessage="Cannot drop more {type} assignments than are assigned."
                    values={{ type: gradeField.type }}
                  />
                )}
                errorEffort={errorList[`${dropCount}-${idx}`]}
              />
            </ol>
            {gradeField.minCount !== courseAssignmentUsage?.length && Boolean(courseAssignmentUsage?.length) && (
              <AlertMessage
                className="course-grading-assignment-item-alert-warning"
                variant="warning"
                icon={Warning}
                title={(
                  <FormattedMessage
                    id="course-authoring.grading-settings.assignment.alert.warning.usage.title"
                    defaultMessage="Warning: The number of {type} assignments defined here does not match the current number of {type} assignments in the course:"
                    values={{ type: gradeField.type }}
                  />
                )}
                description={(
                  <>
                    <span className="course-grading-assignment-item-alert-warning-list-label">
                      {courseAssignmentUsage.length} Final assignment(s) found:
                    </span>
                    <ol className="course-grading-assignment-item-alert-warning-list">
                      {courseAssignmentUsage.map(assignmentItem => (
                        <li key={assignmentItem}>{assignmentItem}</li>
                      ))}
                    </ol>
                  </>
                )}
                aria-hidden="true"
              />
            )}
            {!courseAssignmentUsage?.length && Boolean(gradeField.type) && (
              <AlertMessage
                className="course-grading-assignment-item-alert-warning"
                variant="warning"
                icon={Warning}
                title={(
                  <FormattedMessage
                    id="course-authoring.grading-settings.assignment.alert.warning.title"
                    defaultMessage="Warning: The number of {type} assignments defined here does not match the current number
                    of {type} assignments in the course:"
                    values={{ type: gradeField.type }}
                  />
                )}
                description={(
                  <span className="course-grading-assignment-item-alert-warning-list-label">
                    {intl.formatMessage(messages.assignmentAlertWarningDescription)}
                  </span>
                )}
                aria-hidden="true"
              />
            )}
            {gradeField.minCount === courseAssignmentUsage?.length && (
              <AlertMessage
                className="course-grading-assignment-item-alert-success"
                variant="success"
                icon={CheckCircle}
                title={(
                  <FormattedMessage
                    id="course-authoring.grading-settings.assignment.alert.success.title"
                    defaultMessage="The number of {type} assignments in the course matches the number defined here."
                    values={{ type: gradeField.type }}
                  />
                )}
                aria-hidden="true"
              />
            )}
            <Button
              className="course-grading-assignment-delete-btn"
              variant="tertiary"
              size="sm"
              onClick={() => handleRemoveAssignment(idx)}
            >
              {intl.formatMessage(messages.assignmentDeleteButton)}
            </Button>
          </div>
        );
      })}
    </div>
  );
};

AssignmentSection.defaultProps = {
  courseAssignmentLists: undefined,
  graders: undefined,
};

AssignmentSection.propTypes = {
  intl: intlShape.isRequired,
  handleRemoveAssignment: PropTypes.func.isRequired,
  setGradingData: PropTypes.func.isRequired,
  setShowSavePrompt: PropTypes.func.isRequired,
  setShowSuccessAlert: PropTypes.func.isRequired,
  courseAssignmentLists: PropTypes.shape(defaultAssignmentsPropTypes),
  graders: PropTypes.arrayOf(
    PropTypes.shape(defaultAssignmentsPropTypes),
  ),
};

export default injectIntl(AssignmentSection);

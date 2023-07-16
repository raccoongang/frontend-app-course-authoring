import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@edx/paragon';
import { CheckCircle, Warning } from '@edx/paragon/icons';

import AlertMessage from '../../generic/alert-message';
import AssignmentItem from './AssignmentItem';

const AssignmentSection = ({
  handleRemoveAssignment, setShowSavePrompt, graders, setGradingData, courseAssignmentLists,
}) => {
  const [error, setError] = useState({
    type: false,
    weight: false,
    minCount: false,
    dropCount: false,
  });

  const handleChange = (e, id, minCount) => {
    const { name, value } = e.target;

    setGradingData(prevState => {
      const updatedState = prevState.graders.map(obj => {
        if (obj.id === id) {
          return {
            ...obj,
            [name]: value,
          };
        }
        return obj;
      });

      return { ...prevState, graders: updatedState };
    });

    switch (name) {
    case 'type':
      if (value === '') {
        setError(prevState => ({ ...prevState, [name]: true }));
        return;
      }
      break;
    case 'weight':
      if (value < 0) {
        setError(prevState => ({ ...prevState, [name]: true }));
        return;
      }

      if (value > 100) {
        setError(prevState => ({ ...prevState, [name]: true }));
        return;
      }
      break;
    case 'minCount':
      if (value < 0 || value === '' || value === '-0') {
        setError(prevState => ({ ...prevState, [name]: true }));
        return;
      }
      break;
    case 'dropCount':
      if (value < 0 || value === '' || value === '-0' || value > minCount) {
        setError(prevState => ({ ...prevState, [name]: true }));
        return;
      }
      break;
    default:
      // eslint-disable-next-line no-console
      console.log('Error');
    }

    setShowSavePrompt(true);
    setError(prevState => ({ ...prevState, [name]: false }));
  };

  return (
    <div>
      {graders.map((gradeField, idx) => {
        const courseAssignmentUsage = courseAssignmentLists[gradeField.type.toLowerCase()];
        return (
          <div className="course-grading-assignment-wrapper mb-4">
            <ol className="course-grading-assignment-items p-0 mb-4">
              <AssignmentItem
                className="course-grading-assignment-type-name"
                title="Assignment type name"
                descriptions="The general category for this type of assignment, for example, Homework or Midterm Exam.
    This name is visible to learners."
                type="text"
                name="type"
                value={gradeField.type}
                errorMsg="The assignment type must have a name."
                // errorMsg="For grading to work, you must change all 1 subsections to TEST."
                onChange={(e) => handleChange(e, idx)}
                errorEffort={error.type}
              />
              <AssignmentItem
                className="course-grading-assignment-abbreviation"
                title="Abbreviation"
                descriptions="This short name for the assignment type (for example, HW or Midterm) appears next to
      assignments on a learner's Progress page."
                type="text"
                name="shortLabel"
                value={gradeField.shortLabel}
                onChange={(e) => handleChange(e, idx)}
              />
              <AssignmentItem
                className="course-grading-assignment-total-grade"
                title="Weight of total grade"
                descriptions="The weight of all assignments of this type as a percentage of the total grade,
      for example, 40. Do not include the percent symbol."
                type="number"
                min={0}
                max={100}
                errorMsg="Please enter an integer between 0 and 100."
                name="weight"
                value={gradeField.weight}
                onChange={(e) => handleChange(e, idx)}
                errorEffort={error.weight}
              />
              <AssignmentItem
                className="course-grading-assignment-total-number"
                title="Total number"
                descriptions="The number of subsections in the course that contain problems of this assignment type."
                type="number"
                min={1}
                errorMsg="Please enter an integer greater than 0."
                name="minCount"
                value={gradeField.minCount}
                onChange={(e) => handleChange(e, idx, gradeField.minCount)}
                errorEffort={error.minCount}
              />
              <AssignmentItem
                className="course-grading-assignment-number-droppable"
                title="Number of droppable"
                descriptions="The number of assignments of this type that will be dropped.
      The lowest scoring assignments are dropped first."
                type="number"
                min={0}
                errorMsg="Please enter non-negative integer."
                name="dropCount"
                value={gradeField.dropCount}
                onChange={(e) => handleChange(e, idx)}
                errorEffort={error.dropCount}
              />
            </ol>
            {gradeField.minCount !== courseAssignmentUsage?.length && Boolean(courseAssignmentUsage?.length) && (
              <AlertMessage
                className="course-grading-assignment-item-alert-warning"
                variant="warning"
                icon={Warning}
                title={`Warning: The number of ${gradeField.type} assignments defined here does not match the current number
                of ${gradeField.type} assignments in the course:`}
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
                aria-labelledby="TEXT"
                aria-describedby="TEXT"
              />
            )}
            {gradeField.minCount === courseAssignmentUsage?.length && (
              <AlertMessage
                className="course-grading-assignment-item-alert-success"
                variant="success"
                icon={CheckCircle}
                title={`The number of ${gradeField.type} assignments in the course matches the number defined here.`}
                aria-hidden="true"
                aria-labelledby="TEXT"
                aria-describedby="TEXT"
              />
            )}
            <Button
              className="course-grading-assignment-delete-btn"
              variant="tertiary"
              size="sm"
              onClick={() => handleRemoveAssignment(idx)}
            >
              Delete
            </Button>
          </div>
        );
      })}
    </div>
  );
};

AssignmentSection.propTypes = {
  handleRemoveAssignment: PropTypes.func.isRequired,
  setGradingData: PropTypes.func.isRequired,
  setShowSavePrompt: PropTypes.func.isRequired,
  courseAssignmentLists: PropTypes.arrayOf({
    type: PropTypes.string.isRequired,
    minCount: PropTypes.number.isRequired,
    dropCount: PropTypes.number.isRequired,
    shortLabel: PropTypes.string.isRequired,
    weight: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
  }).isRequired,
  graders: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      minCount: PropTypes.number.isRequired,
      dropCount: PropTypes.number.isRequired,
      shortLabel: PropTypes.string.isRequired,
      weight: PropTypes.number.isRequired,
      id: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default AssignmentSection;

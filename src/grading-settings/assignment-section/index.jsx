import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Alert, Button,
} from '@edx/paragon';
import { Warning } from '@edx/paragon/icons';

import AssignmentItem from './AssignmentItem';

const AssignmentSection = ({
  // eslint-disable-next-line react/prop-types
  idx, handleRemoveAssignment, state, setState, setShowSavePrompt,
}) => {
  const [error, setError] = useState({
    type: false,
    weight: false,
    min_count: false,
    drop_count: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
    case 'type':
      if (value === '') {
        setError(prevState => ({ ...prevState, [name]: true }));
        setState(prevValue => ({ ...prevValue, [name]: value }));
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
    case 'min_count':
      if (value < 0 || value === '' || value === '-0') {
        setError(prevState => ({ ...prevState, [name]: true }));
        return;
      }
      break;
    case 'drop_count':
      // eslint-disable-next-line react/prop-types
      if (value < 0 || value === '' || value === '-0' || value > state.min_count) {
        setError(prevState => ({ ...prevState, [name]: true }));
        return;
      }
      break;
    default:
      // console.log(`Sorry, we are out of ${expr}.`);
    }
    setShowSavePrompt(true);
    setState(prevValue => ({ ...prevValue, [name]: value }));
    setError(prevState => ({ ...prevState, [name]: false }));
  };

  return (
    <div className="course-grading-assignment-wrapper mb-4">
      <ol className="course-grading-assignment-items p-0">
        <AssignmentItem
          className="course-grading-assignment-type-name"
          title="Assignment type name"
          descriptions="The general category for this type of assignment, for example, Homework or Midterm Exam.
        This name is visible to learners."
          type="text"
          name="type"
          errorMsg="The assignment type must have a name."
          // errorMsg="For grading to work, you must change all 1 subsections to TEST."
          onChange={handleChange}
          errorEffort={error.type}
        />
        <AssignmentItem
          className="course-grading-assignment-abbreviation"
          title="Abbreviation"
          descriptions="This short name for the assignment type (for example, HW or Midterm) appears next to
          assignments on a learner's Progress page."
          type="text"
          name="short_label"
          onChange={handleChange}
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
          onChange={handleChange}
          errorEffort={error.weight}
        />
        <AssignmentItem
          className="course-grading-assignment-total-number"
          title="Total number"
          descriptions="The number of subsections in the course that contain problems of this assignment type."
          type="number"
          min={1}
          errorMsg="Please enter an integer greater than 0."
          name="min_count"
          onChange={handleChange}
          errorEffort={error.min_count}
        />
        <AssignmentItem
          className="course-grading-assignment-number-droppable"
          title="Number of droppable"
          descriptions="The number of assignments of this type that will be dropped.
          The lowest scoring assignments are dropped first."
          type="number"
          min={0}
          errorMsg="Please enter non-negative integer."
          name="drop_count"
          onChange={handleChange}
          errorEffort={error.drop_count}
        />
      </ol>
      <Alert variant="warning" icon={Warning}>
        <Alert.Heading>
          Warning: The number of 1 assignments defined here does not match the current number
          of 1 assignments in the course:
        </Alert.Heading>
        There are no assignments of this type in the course.
      </Alert>
      <Button
        className="course-grading-assignment-delete-btn"
        variant="tertiary"
        onClick={() => handleRemoveAssignment(idx)}
      >
        Delete
      </Button>
    </div>
  );
};

AssignmentSection.propTypes = {
  idx: PropTypes.number.isRequired,
  handleRemoveAssignment: PropTypes.func.isRequired,
};

export default AssignmentSection;

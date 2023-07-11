import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Alert, Button,
} from '@edx/paragon';
import { Warning } from '@edx/paragon/icons';

import Assignment from './Assignment';

const AssignmentSection = ({
  // eslint-disable-next-line react/prop-types, no-unused-vars
  idx, handleRemoveAssignment, state, setState, setShowSavePrompt, graders, setGradingData,
}) => {
  const [error, setError] = useState({
    type: false,
    weight: false,
    minCount: false,
    dropCount: false,
  });

  return (
    <div className="course-grading-assignment-wrapper mb-4">
      {/* eslint-disable-next-line react/prop-types, no-shadow */}
      {graders.map((gradeField, idx) => (
        <Assignment
          id={idx}
          error={error}
          gradeField={gradeField}
          setError={setError}
          setShowSavePrompt={setShowSavePrompt}
          setGradingData={setGradingData}
        />
      ))}
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

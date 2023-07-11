import React from 'react';
import AssignmentItem from './AssignmentItem';

const Assignment = ({
  // eslint-disable-next-line react/prop-types
  gradeField, error, setError, id, setShowSavePrompt, setGradingData,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
    case 'type':
      if (value === '') {
        setError(prevState => ({ ...prevState, [name]: true }));
        // setState(prevValue => ({ ...prevValue, [name]: value }));
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
      // eslint-disable-next-line react/prop-types
      if (value < 0 || value === '' || value === '-0' || value > gradeField.minCount) {
        setError(prevState => ({ ...prevState, [name]: true }));
        return;
      }
      break;
    default:
      // console.log(`Sorry, we are out of ${expr}.`);
    }
    setShowSavePrompt(true);
    setGradingData(prevState => {
      // console.log('============== prevState ==============', prevState.graders);
      const updatedState = prevState.graders.map(obj => {
        if (obj.id === id) {
          return { ...obj, [name]: value };
        }
        return obj;
      });

      return { ...prevState, graders: updatedState };
    });
    // setState(prevValue => ({ ...prevValue, [name]: value }));
    setError(prevState => ({ ...prevState, [name]: false }));
  };

  return (
    <ol className="course-grading-assignment-items p-0 mb-4">
      <AssignmentItem
        className="course-grading-assignment-type-name"
        title="Assignment type name"
        descriptions="The general category for this type of assignment, for example, Homework or Midterm Exam.
    This name is visible to learners."
        type="text"
        name="type"
        // eslint-disable-next-line react/prop-types
        value={gradeField.type}
        errorMsg="The assignment type must have a name."
        // errorMsg="For grading to work, you must change all 1 subsections to TEST."
        onChange={handleChange}
        // eslint-disable-next-line react/prop-types
        errorEffort={error.type}
      />
      <AssignmentItem
        className="course-grading-assignment-abbreviation"
        title="Abbreviation"
        descriptions="This short name for the assignment type (for example, HW or Midterm) appears next to
      assignments on a learner's Progress page."
        type="text"
        name="shortLabel"
        // eslint-disable-next-line react/prop-types
        value={gradeField.shortLabel}
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
        // eslint-disable-next-line react/prop-types
        value={gradeField.weight}
        onChange={handleChange}
        // eslint-disable-next-line react/prop-types
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
        // eslint-disable-next-line react/prop-types
        value={gradeField.minCount}
        onChange={handleChange}
        // eslint-disable-next-line react/prop-types
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
        name="dropCount"
        // eslint-disable-next-line react/prop-types
        value={gradeField.dropCount}
        onChange={handleChange}
        // eslint-disable-next-line react/prop-types
        errorEffort={error.drop_count}
      />
    </ol>
  );
};

export default Assignment;

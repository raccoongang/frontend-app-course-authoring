import React, { useState } from 'react';
import { Form } from '@edx/paragon';

// eslint-disable-next-line react/prop-types
const DeadlineSection = ({ setShowSavePrompt, gracePeriod }) => {
  const [periodValue, setPeriodValue] = useState(gracePeriod);
  const handleChange = (e) => {
    const timeArray = e.target.value.split(':');
    setPeriodValue({
      hours: parseInt(timeArray[0], 10),
      minutes: parseInt(timeArray[1], 10),
    });
    setShowSavePrompt(true);
  };
  // console.log('============== periodValue ==========', periodValue);
  return (
    <Form.Group className="w-50">
      <Form.Label className="grading-label">Grace Period on Deadline:</Form.Label>
      <Form.Control
        type="time"
        // floatingLabel="HH:MM"
        value={`${periodValue?.hours}:${periodValue?.minutes}`}
        onChange={handleChange}
      />
      <Form.Control.Feedback className="grading-description">
        Leeway on due dates
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default DeadlineSection;

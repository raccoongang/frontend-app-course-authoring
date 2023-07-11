import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@edx/paragon';

const DeadlineSection = ({ setShowSavePrompt, gracePeriod, setGradingData }) => {
  const handleChange = (e) => {
    const timeArray = e.target.value.split(':');

    setShowSavePrompt(true);
    setGradingData(prevData => ({
      ...prevData,
      gracePeriod: {
        hours: Number(timeArray[0]),
        minutes: Number(timeArray[1]),
      },
    }));
  };

  return (
    <Form.Group className="w-50">
      <Form.Label className="grading-label">Grace Period on Deadline:</Form.Label>
      <Form.Control
        type="time"
        value={`${gracePeriod?.hours}:${gracePeriod?.minutes}`}
        onChange={handleChange}
      />
      <Form.Control.Feedback className="grading-description">
        Leeway on due dates
      </Form.Control.Feedback>
    </Form.Group>
  );
};

DeadlineSection.propTypes = {
  setShowSavePrompt: PropTypes.func.isRequired,
  setGradingData: PropTypes.func.isRequired,
  gracePeriod: PropTypes.objectOf(
    PropTypes.shape({
      hours: PropTypes.number.isRequired,
      minutes: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default DeadlineSection;

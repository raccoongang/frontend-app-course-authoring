import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Form } from '@edx/paragon';

const CreditSection = ({
  eligibleGrade, setShowSavePrompt, minimumGradeCredit, setGradingData,
}) => {
  const [errorEffort, setErrorEffort] = useState(false);

  const handleChange = (e) => {
    const { value } = e.target;

    setGradingData(prevData => ({
      ...prevData,
      minimumGradeCredit: value / 100,
    }));

    if (value <= eligibleGrade) {
      setErrorEffort(true);
      setShowSavePrompt(false);
      return;
    }

    setShowSavePrompt(true);
    setErrorEffort(false);
  };

  return (
    <Form.Group className={classNames('form-group-custom w-50', {
      'form-group-custom_isInvalid': errorEffort,
    })}
    >
      <Form.Label className="grading-label">Minimum Credit-Eligible Grade:</Form.Label>
      <Form.Control
        type="number"
        min={0}
        value={minimumGradeCredit * 100}
        name="minimum_grade_credit"
        isInValid={errorEffort}
        onChange={handleChange}
      />
      <Form.Control.Feedback className="grading-description">
        % Must be greater than or equal to the course passing grade
      </Form.Control.Feedback>
      {errorEffort && (
        <Form.Control.Feedback className="feedback-error" type="invalid">
          Not able to set passing grade to less than: {eligibleGrade}.
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

CreditSection.propTypes = {
  eligibleGrade: PropTypes.number.isRequired,
  setShowSavePrompt: PropTypes.func.isRequired,
  setGradingData: PropTypes.func.isRequired,
  minimumGradeCredit: PropTypes.number.isRequired,
};

export default CreditSection;

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Form } from '@edx/paragon';

// eslint-disable-next-line react/prop-types
const CreditSection = ({ eligibleGrade, setShowSavePrompt, minimumGradeCredit }) => {
  const [errorEffort, setErrorEffort] = useState(false);
  const [credit, setCredit] = useState(minimumGradeCredit);

  const handleChange = (e) => {
    const { value } = e.target;
    setCredit(value);
    if (value <= eligibleGrade) {
      setErrorEffort(true);
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
        value={credit * 100}
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
};

export default CreditSection;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Form } from '@edx/paragon';

const AssignmentItem = ({
  // eslint-disable-next-line react/prop-types
  title, descriptions, type, min, max, errorMsg, className, name, onChange, value, errorEffort,
}) => (
  <li className={className}>
    <Form.Group className={classNames('form-group-custom', {
      'form-group-custom_isInvalid': errorEffort,
    })}
    >
      <Form.Label className="grading-label">{title}</Form.Label>
      <Form.Control
        type={type}
        min={min}
        max={max}
        name={name}
        onChange={onChange}
        value={value}
        isInvalid={errorEffort}
      />
      <Form.Control.Feedback className="grading-description">
        {descriptions}
      </Form.Control.Feedback>
      {errorEffort && (
        <Form.Control.Feedback className="feedback-error" type="invalid">
          {errorMsg}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  </li>
);

AssignmentItem.defaultProps = {
  max: undefined,
};

AssignmentItem.propTypes = {
  title: PropTypes.string.isRequired,
  descriptions: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number,
  errorMsg: PropTypes.number.isRequired,
  className: PropTypes.string.isRequired,
};

export default AssignmentItem;

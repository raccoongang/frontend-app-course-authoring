import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Form } from '@edx/paragon';

const AssignmentItem = ({
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
  errorMsg: undefined,
  min: undefined,
};

AssignmentItem.propTypes = {
  title: PropTypes.string.isRequired,
  descriptions: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  errorMsg: PropTypes.string,
  name: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  errorEffort: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default AssignmentItem;

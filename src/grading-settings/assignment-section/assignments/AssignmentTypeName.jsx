import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Form } from '@edx/paragon';

import messages from '../messages';

const AssignmentTypeName = ({
  intl, value, errorEffort, onChange,
}) => {
  const initialAssignmentName = useRef(value);

  return (
    <li className="course-grading-assignment-type-name">
      <Form.Group className={classNames('form-group-custom', {
        'form-group-custom_isInvalid': errorEffort,
      })}
      >
        <Form.Label className="grading-label">
          {intl.formatMessage(messages.assignmentTypeNameTitle)}
        </Form.Label>
        <Form.Control
          type="text"
          name="type"
          onChange={onChange}
          value={value}
          isInvalid={errorEffort}
        />
        <Form.Control.Feedback className="grading-description">
          {intl.formatMessage(messages.assignmentTypeNameDescription)}
        </Form.Control.Feedback>
        {errorEffort && errorEffort !== 'duplicate' && (
          <Form.Control.Feedback className="feedback-error" type="invalid">
            {intl.formatMessage(messages.assignmentTypeNameErrorMessage1)}
          </Form.Control.Feedback>
        )}
        {value !== initialAssignmentName.current && initialAssignmentName.current !== '' && (
          <Form.Control.Feedback className="feedback-error" type="invalid">
            <FormattedMessage
              id="course-authoring.grading-settings.assignment.type-name.error.message-2"
              defaultMessage="For grading to work, you must change all {initialAssignmentName} subsections to {value}"
              values={{ initialAssignmentName: initialAssignmentName.current, value }}
            />
          </Form.Control.Feedback>
        )}
        {errorEffort === 'duplicate' && (
          <Form.Control.Feedback className="feedback-error" type="invalid">
            {intl.formatMessage(messages.assignmentTypeNameErrorMessage3)}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    </li>
  );
};

AssignmentTypeName.propTypes = {
  intl: intlShape.isRequired,
  onChange: PropTypes.func.isRequired,
  errorEffort: PropTypes.bool.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
};

export default injectIntl(AssignmentTypeName);

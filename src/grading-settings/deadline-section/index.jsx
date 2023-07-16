import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import messages from './messages';

const DeadlineSection = ({
  intl, setShowSavePrompt, gracePeriod, setGradingData,
}) => {
  const formatTime = (time) => (time >= 10 ? time.toString() : `0${time}`);

  const handleDeadlineChange = (e) => {
    const hoursAndMinutes = e.target.value.split(':');
    setShowSavePrompt(true);
    setGradingData(prevData => ({
      ...prevData,
      gracePeriod: {
        hours: Number(hoursAndMinutes[0]),
        minutes: parseInt(hoursAndMinutes[1], 10),
      },
    }));
  };

  return (
    <Form.Group className="w-50">
      <Form.Label className="grading-label">
        {intl.formatMessage(messages.gracePeriodOnDeadlineLabel)}
      </Form.Label>
      <Form.Control
        type="time"
        value={gracePeriod ? `${formatTime(gracePeriod.hours) }:${ formatTime(gracePeriod.minutes)}` : '00:00'}
        onChange={handleDeadlineChange}
      />
      <Form.Control.Feedback className="grading-description">
        {intl.formatMessage(messages.gracePeriodOnDeadlineDescription)}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

DeadlineSection.propTypes = {
  intl: intlShape.isRequired,
  setShowSavePrompt: PropTypes.func.isRequired,
  setGradingData: PropTypes.func.isRequired,
  gracePeriod: PropTypes.shape({
    hours: PropTypes.number,
    minutes: PropTypes.number,
  }).isRequired,
};

export default injectIntl(DeadlineSection);

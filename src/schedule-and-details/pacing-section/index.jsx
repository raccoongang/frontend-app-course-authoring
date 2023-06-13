import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Form } from '@edx/paragon';
import messages from './messages';

const PacingSection = ({
  intl, selfPaced, startDate, onChange,
}) => {
  const canTogglePace = new Date() <= new Date(startDate);

  return (
    <section className="section-container pacing-section">
      <header className="section-header">
        <h2 className="section-header-title">
          {intl.formatMessage(messages.pacingTitle)}
        </h2>
        <span className="section-header-description">
          {intl.formatMessage(messages.pacingDescription)}
        </span>
      </header>
      <Form.Group>
        {!canTogglePace && (
          <Form.Label>
            {intl.formatMessage(messages.pacingRestriction)}
          </Form.Label>
        )}
        <Form.RadioSet
          name="selfPaced"
          onChange={(e) => onChange(e, e.target.name)}
          value={selfPaced.toString()}
        >
          <Form.Radio
            value="false"
            description={intl.formatMessage(messages.pacingTypeInstructorDescription)}
            disabled={!canTogglePace}
          >
            {intl.formatMessage(messages.pacingTypeInstructorLabel)}
          </Form.Radio>
          <Form.Radio
            value="true"
            description={intl.formatMessage(messages.pacingTypeSelfDescription)}
            disabled={!canTogglePace}
          >
            {intl.formatMessage(messages.pacingTypeSelfLabel)}
          </Form.Radio>
        </Form.RadioSet>
      </Form.Group>
    </section>
  );
};

PacingSection.defaultProps = {
  selfPaced: '',
  startDate: '',
};

PacingSection.propTypes = {
  intl: intlShape.isRequired,
  startDate: PropTypes.string,
  selfPaced: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onChange: PropTypes.func.isRequired,
};

export default injectIntl(PacingSection);

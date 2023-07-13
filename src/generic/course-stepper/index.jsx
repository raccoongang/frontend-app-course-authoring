import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import {
  Container, Layout, Button, Card, MailtoLink, Hyperlink, Stepper,
} from '@edx/paragon';

const CourseStepper = ({
  intl,
  courseId,
  steps,
  activeKey,
  errorMessage,
}) => (
  <div>
    <Stepper activeKey={activeKey}>
      <Stepper.Header />
      {steps.map((step) => (
        <div>
          <Stepper.Step
            eventKey={step.key}
            title={step.title}
            description={errorMessage && step.key === activeKey ? errorMessage : step.description}
            hasError={errorMessage && step.key === activeKey}
          />
        </div>
      ))}
    </Stepper>
  </div>
);

CourseStepper.defaultProps = {};

CourseStepper.propTypes = {
  //   intl: intlShape.isRequired,
  //   courseId: PropTypes.string.isRequired,
};

export default injectIntl(CourseStepper);

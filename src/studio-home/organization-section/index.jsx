import React, { useState } from 'react';
import { Button, Form, FormLabel } from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import messages from '../messages';

// TODO: This component will be finalized in the task (https://youtrack.raccoongang.com/issue/2U-47).
const OrganizationSection = ({ intl }) => {
  const [value, setValue] = useState('');

  const handleSettingsChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className="organization-section">
      <h3 className="organization-section-title">
        {intl.formatMessage(messages.organizationTitle)}
      </h3>
      <Form.Group className="organization-section-form d-flex align-items-center">
        <FormLabel className="organization-section-form-label">
          {intl.formatMessage(messages.organizationLabel)}
        </FormLabel>
        <Form.Control
          className="organization-section-form-control"
          onChange={handleSettingsChange}
          value={value}
          placeholder="Label"
        />
      </Form.Group>
      <Button>
        {intl.formatMessage(messages.organizationSubmitBtnText)}
      </Button>
    </div>
  );
};

OrganizationSection.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(OrganizationSection);

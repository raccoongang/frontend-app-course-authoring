import React from 'react';
import { Button, Card } from '@edx/paragon';
import { Add as AddIcon } from '@edx/paragon/icons/es5';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import messages from '../../../messages';

const DefaultSection = ({ intl }) => (
  <Card variant="muted">
    <Card.Section
      title={intl.formatMessage(messages.defaultSection_1_Title)}
      className="default-section-description"
    >
      {intl.formatMessage(messages.defaultSection_1_Description)}
    </Card.Section>
    <Card.Divider />
    <Card.Section
      className="default-section-description"
      title={intl.formatMessage(messages.defaultSection_2_Title)}
      actions={(
        <Button iconBefore={AddIcon} variant="outline-success" disabled>
          {intl.formatMessage(messages.btnReRunText)}
        </Button>
      )}
    >
      {intl.formatMessage(messages.defaultSection_2_Description)}
    </Card.Section>
  </Card>
);

DefaultSection.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(DefaultSection);

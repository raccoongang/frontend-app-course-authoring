import { useIntl } from '@edx/frontend-platform/i18n';
import { Card } from '@edx/paragon';

import messages from '../messages';

const WithoutModes = () => {
  const intl = useIntl();
  return (
    <Card>
      <Card.Section className="d-flex justify-content-center">
        <span className="small">{intl.formatMessage(messages.withoutModesText)}</span>
      </Card.Section>
    </Card>
  );
};

export default WithoutModes;
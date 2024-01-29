import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Stack, Card } from '@openedx/paragon';
import { Add as AddIcon } from '@openedx/paragon/icons';

import MainLayout from '../layout/MainLayout';
import messages from '../messages';

const WithModesWithoutCertificates = ({ courseId }) => {
  const intl = useIntl();
  return (
    <MainLayout showHeaderButtons={false} courseId={courseId}>
      <Card>
        <Card.Section>
          <Stack direction="horizontal" className="justify-content-center align-items-center" gap="3.5">
            <span className="small">{intl.formatMessage(messages.noCertificatesText)}</span>
            <Button
              iconBefore={AddIcon}
            // TODO: Add handler in the task (https://youtrack.raccoongang.com/issue/AXIMST-160)
            >
              {intl.formatMessage(messages.setupCertificateBtn)}
            </Button>
          </Stack>
        </Card.Section>
      </Card>
    </MainLayout>
  );
};

WithModesWithoutCertificates.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default WithModesWithoutCertificates;

import { useDispatch } from 'react-redux';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Stack, Card } from '@edx/paragon';
import { Add as AddIcon } from '@edx/paragon/icons';

import { setMode } from '../data/slice';
import { MODE_STATES } from '../data/constants';
import messages from '../messages';
import { MODE_STATES } from '../data/constants';

const WithModesWithoutCertificates = () => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const handleCreateMode = () => {
    dispatch(setMode(MODE_STATES.create));
  };

  return (
    <Card>
      <Card.Section>
        <Stack direction="horizontal" className="justify-content-center align-items-center" gap="3.5">
          <span className="small">{intl.formatMessage(messages.noCertificatesText)}</span>
          <Button
            iconBefore={AddIcon}
            onClick={handleCreateMode}
          >
            {intl.formatMessage(messages.setupCertificateBtn)}
          </Button>
        </Stack>
      </Card.Section>
    </Card>
  );
};

export default WithModesWithoutCertificates;

import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Stack } from '@edx/paragon';
import { Add as AddIcon } from '@edx/paragon/icons';

import MainLayout from '../layout/MainLayout';
import messages from '../messages';

const WithModesWithoutCertificates = ({ courseId }) => {
  const intl = useIntl();
  return (
    <MainLayout showHeaderButtons={false} courseId={courseId}>
      <Stack direction="horizontal" className="p-5 justify-content-center align-items-center bg-light-300" gap="3.5">
        <span>{intl.formatMessage(messages.noCertificatesText)}</span>
        <Button
          alt={intl.formatMessage(messages.setupCertificateBtnAlt)}
          variant="primary"
          iconBefore={AddIcon}
          // TODO: Add handler in the task (https://youtrack.raccoongang.com/issue/AXIMST-160)
        >
          {intl.formatMessage(messages.setupCertificateBtn)}
        </Button>
      </Stack>
    </MainLayout>
  );
};

WithModesWithoutCertificates.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default WithModesWithoutCertificates;

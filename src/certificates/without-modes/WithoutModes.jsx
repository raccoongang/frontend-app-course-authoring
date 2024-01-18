import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';

import MainLayout from '../layout/MainLayout';
import messages from '../messages';

const WithoutModes = ({ courseId }) => {
  const intl = useIntl();
  return (
    <MainLayout showHeaderButtons={false} courseId={courseId}>
      <div className="d-flex p-5 justify-content-center align-items-center bg-light-300">
        <span>{intl.formatMessage(messages.withoutModesText)}</span>
      </div>
    </MainLayout>
  );
};

WithoutModes.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default WithoutModes;

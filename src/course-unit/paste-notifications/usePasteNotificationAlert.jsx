import { useState } from 'react';
import {
  Error as ErrorIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
} from '@edx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';

import AlertMessage from '../../generic/alert-message';
import ActionButton from './ActionButton';
import AlertContent from './AlertContent';
import messages from './messages';

const initialState = {
  conflictingFilesAlert: true,
  errorFilesAlert: true,
  newFilesAlert: true,
};

const usePastNotificationAlerts = (staticFileNotices, courseId) => {
  const intl = useIntl();
  const [notificationAlerts, toggleNotificationAlerts] = useState(initialState);
  const { conflictingFiles, errorFiles, newFiles } = staticFileNotices;

  const hasConflictingErrors = conflictingFiles?.length
    ? conflictingFiles && notificationAlerts.conflictingFilesAlert : null;
  const hasErrorFiles = errorFiles?.length ? errorFiles && notificationAlerts.errorFilesAlert : null;
  const hasNewFiles = newFiles?.length ? newFiles && notificationAlerts.newFilesAlert : null;

  const handleCloseNotificationAlert = (alertKey) => {
    toggleNotificationAlerts((prevAlerts) => ({
      ...prevAlerts,
      [alertKey]: false,
    }));
  };

  return (
    <>
      {hasConflictingErrors && (
        <AlertMessage
          data-testid="has-conflicting-errors-alert"
          title={intl.formatMessage(messages.hasConflictingErrorsTitle)}
          onClose={() => handleCloseNotificationAlert('conflictingFilesAlert')}
          description={(
            <AlertContent
              fileList={conflictingFiles}
              text={intl.formatMessage(messages.hasConflictingErrorsDescription)}
            />
          )}
          variant="warning"
          icon={WarningIcon}
          dismissible
          actions={[
            <ActionButton
              courseId={courseId}
              title={intl.formatMessage(messages.hasConflictingErrorsButtonText)}
            />,
          ]}
        />
      )}
      {hasErrorFiles && (
        <AlertMessage
          data-testid="has-error-files-alert"
          title={intl.formatMessage(messages.hasErrorsTitle)}
          onClose={() => handleCloseNotificationAlert('errorFilesAlert')}
          description={(
            <AlertContent
              fileList={errorFiles}
              text={intl.formatMessage(messages.hasErrorsDescription)}
            />
          )}
          variant="danger"
          icon={ErrorIcon}
          dismissible
        />
      )}
      {hasNewFiles && (
        <AlertMessage
          data-testid="has-new-files-alert"
          title={intl.formatMessage(messages.hasNewFilesTitle)}
          onClose={() => handleCloseNotificationAlert('newFilesAlert')}
          description={(
            <AlertContent
              fileList={newFiles}
              text={intl.formatMessage(messages.hasNewFilesDescription)}
            />
          )}
          variant="info"
          icon={InfoIcon}
          dismissible
          actions={[
            <ActionButton
              courseId={courseId}
              title={intl.formatMessage(messages.hasNewFilesButtonText)}
            />,
          ]}
        />
      )}
    </>
  );
};

export default usePastNotificationAlerts;

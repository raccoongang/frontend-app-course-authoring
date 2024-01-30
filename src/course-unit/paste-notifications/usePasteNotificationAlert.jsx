import { Error as ErrorIcon, Info as InfoIcon, Warning as WarningIcon } from '@edx/paragon/icons/es5';
import { useState } from 'react';
import AlertMessage from '../../generic/alert-message';
import ActionButton from './ActionButton';
import AlertContent from './AlertContent';

const usePastNotificationAlerts = (staticFileNotices, courseId) => {
  const [alerts, setAlerts] = useState({
    conflictingFilesAlert: true,
    errorFilesAlert: true,
    newFilesAlert: true,
  });

  const { conflictingFiles, errorFiles, newFiles } = staticFileNotices;
  console.log({ staticFileNotices });
  const handleClose = (alertKey) => {
    setAlerts((prevAlerts) => ({
      ...prevAlerts,
      [alertKey]: false,
    }));
  };

  return (
    <>
      {conflictingFiles && alerts.conflictingFilesAlert && (
        <AlertMessage
          title="Files need to be updated manually."
          onClose={() => handleClose('conflictingFilesAlert')}
          description={(
            <AlertContent
              files={conflictingFiles}
              text="The following files must be updated manually for components to work as intended:"
            />
          )}
          variant="warning"
          icon={WarningIcon}
          dismissible
          actions={[<ActionButton courseId={courseId} title="Upload files" />]}
        />
      )}
      {errorFiles && alerts.errorFilesAlert && (
        <AlertMessage
          title="Some errors occurred"
          onClose={() => handleClose('errorFilesAlert')}
          description={(
            <AlertContent
              files={errorFiles}
              text="The following required files could not be added to the course:"
            />
          )}
          variant="danger"
          icon={ErrorIcon}
          dismissible
        />
      )}
      {newFiles && alerts.newFilesAlert && (
        <AlertMessage
          title="New file(s) added to Files & Uploads."
          onClose={() => handleClose('newFilesAlert')}
          description={(
            <AlertContent
              files={newFiles}
              text="The following required files were imported to this course:"
            />
          )}
          variant="info"
          icon={InfoIcon}
          dismissible
          actions={[<ActionButton courseId={courseId} title="View files" />]}
        />
      )}
    </>
  );
};

export default usePastNotificationAlerts;

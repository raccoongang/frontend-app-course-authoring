import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Warning as WarningIcon } from '@openedx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';

import { RequestStatus } from '../../data/constants';
import AlertMessage from '../alert-message';
import messages from './messages';

const SavingErrorNotification = ({
  savingStatus,
  errorMessage,
}) => {
  const intl = useIntl();
  const [showAlert, setShowAlert] = useState(false);
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const isQueryFailed = savingStatus === RequestStatus.FAILED;

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(window.navigator.onLine);
    const events = ['online', 'offline'];

    events.forEach((event) => {
      window.addEventListener(event, handleOnlineStatus);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleOnlineStatus);
      });
    };
  }, [isOnline]);

  useEffect(() => {
    setShowAlert((!isOnline && isQueryFailed) || isQueryFailed);
  }, [isQueryFailed, isOnline]);

  return (
    <AlertMessage
      show={showAlert}
      variant="danger"
      icon={WarningIcon}
      title={intl.formatMessage(messages.warningTitle)}
      description={
        errorMessage || intl.formatMessage(messages.warningDescription)
      }
      aria-hidden="true"
      aria-labelledby={intl.formatMessage(
        messages.warningTitleAriaLabelledBy,
      )}
      aria-describedby={intl.formatMessage(
        messages.warningDescriptionAriaDescribedBy,
      )}
    />
  );
};

SavingErrorNotification.defaultProps = {
  errorMessage: undefined,
};

SavingErrorNotification.propTypes = {
  savingStatus: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
};

export default SavingErrorNotification;

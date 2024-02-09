import PropTypes from 'prop-types';
import { Alert } from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Info as InfoIcon, WarningFilled as WarningIcon } from '@edx/paragon/icons';

import messages from '../messages';
import { MESSAGE_ERROR_TYPES } from '../constants';
import { getMessagesBlockType } from './utils';

const XBlockMessages = ({ validationMessages }) => {
  const intl = useIntl();
  const type = getMessagesBlockType(validationMessages);

  if (!validationMessages.length) {
    return null;
  }

  return (
    <Alert
      variant={type === MESSAGE_ERROR_TYPES.warning ? 'warning' : 'danger'}
      icon={type === MESSAGE_ERROR_TYPES.warning ? WarningIcon : InfoIcon}
    >
      <Alert.Heading>
        {intl.formatMessage(messages.validationSummary)}
      </Alert.Heading>
      <ul>
        {validationMessages.map(({ text }) => (
          <li key={text}>{text}</li>
        ))}
      </ul>
    </Alert>
  );
};

XBlockMessages.defaultProps = {
  validationMessages: [],
};

XBlockMessages.propTypes = {
  validationMessages: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string,
    text: PropTypes.string,
  })),
};

export default XBlockMessages;

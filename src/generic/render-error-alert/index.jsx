import PropTypes from 'prop-types';
import { Info as InfoIcon } from '@edx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';

import AlertMessage from '../alert-message';
import messages from './messages';

const RenderErrorAlert = ({
  variant, icon, title, description, errorMessage, ...props
}) => {
  const intl = useIntl();

  return (
    <AlertMessage
      variant={variant}
      icon={icon}
      title={title || intl.formatMessage(messages.alertRenderErrorTitle)}
      description={description || (
        <>
          <p className="mt-4 mb-1">{intl.formatMessage(messages.alertRenderErrorDescription)}</p>
          <p className="mb-0">{intl.formatMessage(messages.alertRenderErrorMessage, { message: errorMessage })}</p>
        </>
      )}
      {...props}
    />
  );
};

RenderErrorAlert.defaultProps = {
  icon: InfoIcon,
  variant: 'danger',
  title: '',
  description: '',
};

RenderErrorAlert.propTypes = {
  variant: 'danger',
  icon: PropTypes.node,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  errorMessage: PropTypes.string.isRequired,
};

export default RenderErrorAlert;

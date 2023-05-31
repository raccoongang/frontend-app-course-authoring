import React from 'react';
import { Alert } from '@edx/paragon';
import PropTypes from 'prop-types';

const SettingAlert = ({
  title, description, proctoringErrorsData, ...props
}) => {
  if (proctoringErrorsData) {
    return (
      <ul className="alert-proctoring-error p-0">
        <Alert {...props}>
          {proctoringErrorsData.map(({ key, model, message }) => (
            <li key={key}>
              <Alert.Heading>{model.displayName}</Alert.Heading>
              <p>{message}</p>
            </li>
          ))}
        </Alert>
      </ul>
    );
  }
  return (
    <Alert {...props}>
      <Alert.Heading>{title}</Alert.Heading>
      <p>{description}</p>
    </Alert>
  );
};

SettingAlert.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  proctoringErrorsData: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    message: PropTypes.string,
    model: PropTypes.shape({
      deprecated: PropTypes.bool,
      displayName: PropTypes.string,
      help: PropTypes.string,
      hideOnEnabledPublisher: PropTypes.bool,
    }),
    value: PropTypes.string,
  })),
};

SettingAlert.defaultProps = {
  title: undefined,
  proctoringErrorsData: undefined,
  description: undefined,
};

export default SettingAlert;

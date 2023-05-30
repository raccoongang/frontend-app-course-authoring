import React from 'react';
import { Alert } from '@edx/paragon';
import PropTypes from 'prop-types';

const SettingAlert = ({
  title, description, data, ...props
}) => {
  if (data) {
    return (
      <ul>
        <Alert {...props}>
          {data.map(({ model, message }) => (
            <li>
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
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  data: PropTypes.arrayOf({
    model: PropTypes.shape({
      displayName: PropTypes.string,
    }),
    message: PropTypes.string,
  }),
};

SettingAlert.defaultProps = {
  data: undefined,
};

export default SettingAlert;

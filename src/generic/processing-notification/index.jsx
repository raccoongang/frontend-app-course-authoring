import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Badge, Icon } from '@edx/paragon';
import { Settings as IconSettings } from '@edx/paragon/icons';

const ProcessingNotification = ({ isShow, title }) => (
  <Badge
    className={classNames('processing-notification', {
      'is-show': isShow,
    })}
    variant="secondary"
    aria-hidden={isShow}
  >
    <Icon className="processing-notification-icon" src={IconSettings} />
    <h2 className="processing-notification-title">
      {title}
    </h2>
  </Badge>
);

ProcessingNotification.propTypes = {
  isShow: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};

export default ProcessingNotification;

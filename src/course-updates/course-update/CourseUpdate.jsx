import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import { Error as ErrorIcon } from '@edx/paragon/icons/es5';
import messages from './messages';
import { isDateForUpdateValid } from './utils';

const CourseUpdate = ({
  dateForUpdate,
  contentForUpdate,
  onEdit,
  onDelete,
  isDisabledButtons,
}) => {
  const intl = useIntl();

  return (
    <div className="course-update" data-testid="course-update">
      <div className="course-update-header">
        <span className="course-update-header__date small font-weight-bold">{dateForUpdate}</span>
        {!isDateForUpdateValid(dateForUpdate) && (
          <div className="course-update-header__error">
            <Icon src={ErrorIcon} alt={intl.formatMessage(messages.errorAltText)} />
            <span className="message-error small">{intl.formatMessage(messages.errorMessage)}</span>
          </div>
        )}
        <div className="course-update-header__action">
          <Button variant="outline-primary" size="sm" onClick={onEdit} disabled={isDisabledButtons}>
            {intl.formatMessage(messages.editButton)}
          </Button>
          <Button variant="outline-primary" size="sm" onClick={onDelete} disabled={isDisabledButtons}>
            {intl.formatMessage(messages.deleteButton)}
          </Button>
        </div>
      </div>
      {Boolean(contentForUpdate) && (
        <div
          className="small text-gray-800"
          data-testid="course-update-content"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: contentForUpdate }}
        />
      )}
    </div>
  );
};

CourseUpdate.propTypes = {
  dateForUpdate: PropTypes.string.isRequired,
  contentForUpdate: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isDisabledButtons: PropTypes.bool.isRequired,
};

export default CourseUpdate;

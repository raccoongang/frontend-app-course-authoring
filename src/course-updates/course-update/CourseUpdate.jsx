import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from './messages';

const CourseUpdate = ({
  updateDate,
  updateContent,
  onEdit,
  onDelete,
  isDisabledButtons,
}) => {
  const intl = useIntl();

  return (
    <div className="course-update" data-testid="course-update">
      <div className="course-update-header">
        <span className="course-update-header__date small font-weight-bold">{updateDate}</span>
        <div className="course-update-header__action">
          <Button variant="outline-primary" size="sm" onClick={onEdit} disabled={isDisabledButtons}>
            {intl.formatMessage(messages.editButton)}
          </Button>
          <Button variant="outline-primary" size="sm" onClick={onDelete} disabled={isDisabledButtons}>
            {intl.formatMessage(messages.deleteButton)}
          </Button>
        </div>
      </div>
      {Boolean(updateContent) && (
        <div
          className="course-update-content text-gray-800"
          data-testid="course-update-content"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: updateContent }}
        />
      )}
    </div>
  );
};

CourseUpdate.propTypes = {
  updateDate: PropTypes.string.isRequired,
  updateContent: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isDisabledButtons: PropTypes.bool.isRequired,
};

export default CourseUpdate;

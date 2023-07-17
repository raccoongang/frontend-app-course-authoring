import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import messages from './messages';

const CourseUpdate = ({
  updateDate, updateContent, onEdit, onDelete,
}) => {
  const intl = useIntl();

  return (
    <div className="course-update" data-testid="course-update">
      <div className="course-update-header">
        <span className="course-update-header__date">{updateDate}</span>
        <div className="course-update-header__action">
          <Button variant="outline-primary" size="sm" onClick={onEdit}>
            {intl.formatMessage(messages.editButton)}
          </Button>
          <Button variant="outline-primary" size="sm" onClick={onDelete}>
            {intl.formatMessage(messages.deleteButton)}
          </Button>
        </div>
      </div>
      {/* eslint-disable-next-line react/no-danger */}
      {updateContent ? <div className="course-update-content" dangerouslySetInnerHTML={{ __html: updateContent }} /> : null}
    </div>
  );
};

CourseUpdate.propTypes = {
  updateDate: PropTypes.string.isRequired,
  updateContent: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CourseUpdate;

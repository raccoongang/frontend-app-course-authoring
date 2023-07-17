import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import messages from '../messages';

const CourseHandouts = ({ isExample, handoutsContent, onEdit }) => {
  const intl = useIntl();

  return (
    <div className="course-handouts" data-testid="course-handouts">
      <div className="course-handouts-header">
        <h2 className="course-handouts-header__title lead">{intl.formatMessage(messages.handoutsTitle)}</h2>
        <Button
          className="course-handouts__btn"
          variant="outline-primary"
          size="sm"
          onClick={onEdit}
        >
          {intl.formatMessage(messages.buttons.edit)}
        </Button>
      </div>
      {isExample ? (
        // eslint-disable-next-line react/no-danger
        <div className="course-handouts-content" dangerouslySetInnerHTML={{ __html: handoutsContent }} />
      ) : null}
    </div>
  );
};

CourseHandouts.propTypes = {
  isExample: PropTypes.bool.isRequired,
  handoutsContent: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default CourseHandouts;

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import HelpSidebar from '../../generic/help-sidebar';
import messages from './messages';

const CourseTeamSideBar = ({ courseId, isOwnershipHint }) => {
  const intl = useIntl();

  return (
    <div className="course-team-sidebar" data-testid="course-team-sidebar">
      <HelpSidebar
        intl={intl}
        courseId={courseId}
        showOtherSettings={false}
      >
        <h4 className="help-sidebar-about-title">
          {intl.formatMessage(messages.sidebarTitle)}
        </h4>
        <p className="help-sidebar-about-descriptions">
          {intl.formatMessage(messages.sidebarAbout_1)}
        </p>
        <p className="help-sidebar-about-descriptions">
          {intl.formatMessage(messages.sidebarAbout_2)}
        </p>
        <p className="help-sidebar-about-descriptions">
          {intl.formatMessage(messages.sidebarAbout_3)}
        </p>
      </HelpSidebar>
      {isOwnershipHint ? (
        <HelpSidebar
          intl={intl}
          courseId={courseId}
          showOtherSettings={false}
        >
          <h4 className="help-sidebar-about-title">
            {intl.formatMessage(messages.ownershipTitle)}
          </h4>
          <p className="help-sidebar-about-descriptions">
            <FormattedMessage
              id="course-authoring.course-team.member.button.add"
              defaultMessage="Every course must have an Admin. If you are the Admin and you want to transfer ownership of the course, click {strong} to make another user the Admin, then ask that user to remove you from the Course Team list."
              values={{ strong: <strong>{intl.formatMessage(messages.addAdminAccess)}</strong> }}
            />
          </p>
        </HelpSidebar>
      ) : null}
    </div>
  );
};

CourseTeamSideBar.propTypes = {
  courseId: PropTypes.string.isRequired,
  isOwnershipHint: PropTypes.bool.isRequired,
};

export default CourseTeamSideBar;

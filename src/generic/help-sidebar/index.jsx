import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';

import { getPagePath } from '../../utils';
import messages from './messages';
import HelpSidebarLink from './HelpSidebarLink';

const HelpSidebar = ({
  intl,
  courseId,
  showOtherSettings,
  proctoredExamSettingsUrl,
  children,
  className,
}) => {
  const { pathname } = useLocation();
  const scheduleAndDetailsDestination = getPagePath(
    courseId,
    process.env.ENABLE_NEW_SCHEDULE_DETAILS_PAGE,
    'settings/details',
  );
  const gradingDestination = getPagePath(
    courseId,
    process.env.ENABLE_NEW_GRADING_PAGE,
    'settings/grading',
  );
  const studioHomeDestination = getPagePath(
    courseId,
    process.env.ENABLE_NEW_HOME_PAGE,
    'home',
  );
  const courseTeamDestination = getPagePath(
    courseId,
    process.env.ENABLE_NEW_COURSE_TEAM_PAGE,
    'course_team',
  );
  const advancedSettingsDestination = getPagePath(
    courseId,
    process.env.ENABLE_NEW_ADVANCED_SETTINGS_PAGE,
    'settings/advanced',
  );
  const groupConfigurationsDestination = new URL(
    `/group_configurations/${courseId}`,
    getConfig().STUDIO_BASE_URL,
  ).href;
  const proctoredExamSettingsDestination = new URL(
    `/course/${courseId}/proctored-exam-settings`,
    getConfig().BASE_URL,
  ).href;

  const shouldShowLink = (path) => !path.includes(pathname) && !studioHomeDestination.includes(pathname);

  return (
    <aside className={classNames('help-sidebar', className)}>
      <div className="help-sidebar-about">{children}</div>
      {studioHomeDestination.includes(pathname) && (
        <HelpSidebarLink
          as="span"
          // TODO: the link will be fetched in the future from the backend response.
          pathToPage="#"
          title={intl.formatMessage(messages.studioHomeLinkToGettingStarted)}
        />
      )}
      {showOtherSettings && (
        <>
          <hr />
          <div className="help-sidebar-other">
            <h4 className="help-sidebar-other-title">
              {intl.formatMessage(messages.sidebarTitleOther)}
            </h4>
            <nav
              className="help-sidebar-other-links"
              aria-label={intl.formatMessage(messages.sidebarTitleOther)}
            >
              <ul className="p-0 mb-0">
                {shouldShowLink(scheduleAndDetailsDestination) && (
                  <HelpSidebarLink
                    pathToPage={scheduleAndDetailsDestination}
                    title={intl.formatMessage(messages.sidebarLinkToScheduleAndDetails)}
                  />
                )}
                {shouldShowLink(gradingDestination) && (
                  <HelpSidebarLink
                    pathToPage={gradingDestination}
                    title={intl.formatMessage(messages.sidebarLinkToGrading)}
                  />
                )}
                {shouldShowLink(courseTeamDestination) && (
                  <HelpSidebarLink
                    pathToPage={courseTeamDestination}
                    title={intl.formatMessage(messages.sidebarLinkToCourseTeam)}
                  />
                )}
                {proctoredExamSettingsUrl && shouldShowLink(proctoredExamSettingsUrl) && (
                  <HelpSidebarLink
                    pathToPage={proctoredExamSettingsUrl}
                    title={intl.formatMessage(messages.sidebarLinkToProctoredExamSettings)}
                  />
                )}
                {shouldShowLink(groupConfigurationsDestination) && (
                  <HelpSidebarLink
                    pathToPage={groupConfigurationsDestination}
                    title={intl.formatMessage(messages.sidebarLinkToGroupConfigurations)}
                  />
                )}
                {shouldShowLink(advancedSettingsDestination) && (
                  <HelpSidebarLink
                    pathToPage={advancedSettingsDestination}
                    title={intl.formatMessage(messages.sidebarLinkToAdvancedSettings)}
                  />
                )}
                {shouldShowLink(proctoredExamSettingsDestination) && shouldShowLink(gradingDestination) && (
                  <HelpSidebarLink
                    pathToPage={proctoredExamSettingsDestination}
                    title={intl.formatMessage(messages.sidebarLinkToProctoredExamSettings)}
                  />
                )}
              </ul>
            </nav>
          </div>
        </>
      )}
    </aside>
  );
};

HelpSidebar.defaultProps = {
  proctoredExamSettingsUrl: '',
  className: undefined,
  courseId: undefined,
  showOtherSettings: false,
};

HelpSidebar.propTypes = {
  intl: intlShape.isRequired,
  courseId: PropTypes.string,
  showOtherSettings: PropTypes.bool,
  proctoredExamSettingsUrl: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default injectIntl(HelpSidebar);

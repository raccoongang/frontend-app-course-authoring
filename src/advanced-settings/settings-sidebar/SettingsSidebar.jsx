import React, { useContext } from 'react';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';
import PropTypes from 'prop-types';
import { Hyperlink } from '@edx/paragon';

import { getPagePath } from '../../utils';
import messages from './messages';

const SettingsSidebar = ({ intl, courseId }) => {
  const { config } = useContext(AppContext);
  return (
    <aside className="setting-sidebar__supplementary">
      <div className="setting-sidebar__supplementary-about">
        <h4 className="setting-sidebar__supplementary-about--title">{intl.formatMessage(messages.about)}</h4>
        <p className="setting-sidebar__supplementary-about--descriptions">
          {intl.formatMessage(messages.aboutDescription1)}
        </p>
        <p className="setting-sidebar__supplementary-about--descriptions">
          {intl.formatMessage(messages.aboutDescription2)}
        </p>
        <p className="setting-sidebar__supplementary-about--descriptions">
          <FormattedMessage
            id="course-authoring.advanced-settings.about.description-3"
            defaultMessage="{notice} When you enter strings as policy values, ensure that you use double quotation marks (“) around the string. Do not use single quotation marks (‘)."
            values={{ notice: <strong>Note:</strong> }}
          />
        </p>
      </div>
      <hr />
      <div className="setting-sidebar__supplementary-other">
        <h4 className="setting-sidebar__supplementary-other-title">{intl.formatMessage(messages.other)}</h4>
        <nav className="setting-sidebar__supplementary-other-links" aria-label={intl.formatMessage(messages.other)}>
          <ul className="p-0 mb-0">
            <li className="setting-sidebar__supplementary-other-link">
              <Hyperlink
                rel="noopener"
                destination={getPagePath(courseId, config, process.env.ENABLE_NEW_SCHEDULE_DETAILS_PAGE, 'settings/details')}
              >
                {intl.formatMessage(messages.otherCourseSettingsLink1)}
              </Hyperlink>
            </li>
            <li className="setting-sidebar__supplementary-other-link">
              <Hyperlink
                rel="noopener"
                destination={getPagePath(courseId, config, process.env.ENABLE_NEW_GRADING_PAGE, 'settings/grading')}
              >
                {intl.formatMessage(messages.otherCourseSettingsLink2)}
              </Hyperlink>
            </li>
            <li className="setting-sidebar__supplementary-other-link">
              <Hyperlink
                rel="noopener"
                destination={getPagePath(courseId, config, process.env.ENABLE_NEW_COURSE_TEAM_PAGE, 'course_team')}
              >
                {intl.formatMessage(messages.otherCourseSettingsLink3)}
              </Hyperlink>
            </li>
            <li className="setting-sidebar__supplementary-other-link">
              <Hyperlink
                rel="noopener"
                destination={`${config.STUDIO_BASE_URL}/group_configurations/course-v1:${courseId}`}
              >
                {intl.formatMessage(messages.otherCourseSettingsLink4)}
              </Hyperlink>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

SettingsSidebar.propTypes = {
  intl: intlShape.isRequired,
  courseId: PropTypes.string.isRequired,
};

export default injectIntl(SettingsSidebar);

import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Hyperlink } from '@edx/paragon';

import { HelpSidebar } from '../../generic/help-sidebar';
import { useHelpUrls } from '../../help-urls/hooks';
import { getSidebarData } from './utils';
import messages from './messages';

const GroupConfigurationSidebar = ({
  courseId, shouldShowExperimentGroups, shouldShowContentGroup, shouldShowEnrollmentTrackGroup,
}) => {
  const intl = useIntl();
  const urls = useHelpUrls(['groupConfigurations', 'enrollmentTracks', 'contentGroups']);
  return (
    <HelpSidebar
      courseId={courseId}
      showOtherSettings
    >
      {getSidebarData({
        messages, intl, shouldShowExperimentGroups, shouldShowContentGroup, shouldShowEnrollmentTrackGroup,
      })
        .map(({ title, paragraphs, urlKey }, id) => (
          <React.Fragment key={title}>
            <h4 className="help-sidebar-about-title">
              {title}
            </h4>
            {paragraphs.map((text) => (
              <p key={text} className="help-sidebar-about-descriptions">
                {text}
              </p>
            ))}
            <Hyperlink
              target="_blank"
              showLaunchIcon={false}
              href={urls[urlKey]}
              className="mt-2 mb-3.5"
            >
              {intl.formatMessage(messages.learnMoreBtn)}
            </Hyperlink>
            {!(id === getSidebarData({ messages, intl }).length - 1) && <hr />}
          </React.Fragment>
        ))}
    </HelpSidebar>
  );
};

GroupConfigurationSidebar.propTypes = {
  courseId: PropTypes.string.isRequired,
  shouldShowContentGroup: PropTypes.bool.isRequired,
  shouldShowExperimentGroups: PropTypes.bool.isRequired,
  shouldShowEnrollmentTrackGroup: PropTypes.bool.isRequired,
};

export default GroupConfigurationSidebar;

import React from 'react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';

import HelpSidebar from '../../generic/HelpSidebar';
import messages from './messages';

const GradingSidebar = ({ intl, courseId, gradingUrl }) => (
  <HelpSidebar
    courseId={courseId}
    gradingDestination={gradingUrl}
    showOtherSettings
  >
    <h4 className="help-sidebar-about-title">
      {intl.formatMessage(messages.gradingSidebarTitle)}
    </h4>
    <p className="help-sidebar-about-descriptions">
      {intl.formatMessage(messages.gradingSidebarAbout1)}
    </p>
    <p className="help-sidebar-about-descriptions">
      {intl.formatMessage(messages.gradingSidebarAbout2)}
    </p>
    <p className="help-sidebar-about-descriptions">
      {intl.formatMessage(messages.gradingSidebarAbout3)}
    </p>
  </HelpSidebar>
);

GradingSidebar.defaultProps = {
  gradingUrl: '',
};

GradingSidebar.propTypes = {
  intl: intlShape.isRequired,
  courseId: PropTypes.string.isRequired,
  gradingUrl: PropTypes.string,
};

export default injectIntl(GradingSidebar);

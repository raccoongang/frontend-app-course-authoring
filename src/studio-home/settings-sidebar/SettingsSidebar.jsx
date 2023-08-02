import React from 'react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import HelpSidebar from '../../generic/help-sidebar';
import messages from './messages';

const SettingsSidebar = ({ intl }) => (
  <HelpSidebar>
    <h4 className="help-sidebar-about-title">
      {intl.formatMessage(messages.aboutTitle)}
    </h4>
    <p className="help-sidebar-about-descriptions">
      {intl.formatMessage(messages.aboutDescription)}
    </p>
  </HelpSidebar>
);

SettingsSidebar.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(SettingsSidebar);

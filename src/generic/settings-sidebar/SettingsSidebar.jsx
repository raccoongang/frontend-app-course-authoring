import React from 'react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';
import { Hyperlink } from '@edx/paragon';
import messages from './messages';

const SettingsSidebar = ({
 intl, title, links, children,
}) => (
  <aside className="setting-sidebar-supplementary">
    <div className="setting-sidebar-supplementary-about">
      <h4 className="setting-sidebar-supplementary-about-title">{title}</h4>
      {children}
    </div>
    <hr />
    <div className="setting-sidebar-supplementary-other">
      <h4 className="setting-sidebar-supplementary-other-title">{intl.formatMessage(messages.other)}</h4>
      <nav className="setting-sidebar-supplementary-other-links" aria-label={intl.formatMessage(messages.other)}>
        <ul className="p-0 mb-0">
          {links?.map(({ name, destination }) => (
            <li key={name} className="setting-sidebar-supplementary-other-link">
              <Hyperlink rel="noopener" destination={destination}>
                {name}
              </Hyperlink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  </aside>
  );

SettingsSidebar.propTypes = {
  intl: intlShape.isRequired,
  title: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(
    PropTypes.exact({
        name: PropTypes.string.isRequired,
        destination: PropTypes.string.isRequired,
    }),
  ).isRequired,
  children: PropTypes.node.isRequired,
};

export default injectIntl(SettingsSidebar);

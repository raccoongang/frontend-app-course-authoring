import React from 'react';
import {
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';
import { Button } from '@edx/paragon';
import HelpSidebar from '../../generic/help-sidebar';
import messages from './messages';

const ExportSidebar = ({ intl, courseId }) => (
  <HelpSidebar courseId={courseId}>
    <h4 className="help-sidebar-about-title">{intl.formatMessage(messages.title1)}</h4>
    <p className="help-sidebar-about-descriptions">{intl.formatMessage(messages.description1)}</p>
    <hr />
    <h4 className="help-sidebar-about-title">{intl.formatMessage(messages.exportedContent)}</h4>
    <p className="help-sidebar-about-descriptions">{intl.formatMessage(messages.exportedContentHeading)}</p>
    <p className="help-sidebar-about-descriptions">{intl.formatMessage(messages.content1)}</p>
    <p className="help-sidebar-about-descriptions">{intl.formatMessage(messages.content2)}</p>
    <p className="help-sidebar-about-descriptions">{intl.formatMessage(messages.content3)}</p>
    <p className="help-sidebar-about-descriptions">{intl.formatMessage(messages.content4)}</p>
    <p className="help-sidebar-about-descriptions">{intl.formatMessage(messages.content5)}</p>
    <p className="help-sidebar-about-descriptions">{intl.formatMessage(messages.notExportedContent)}</p>
    <p className="help-sidebar-about-descriptions">{intl.formatMessage(messages.content6)}</p>
    <p className="help-sidebar-about-descriptions">{intl.formatMessage(messages.content7)}</p>
    <hr />
    <h4 className="help-sidebar-about-title">{intl.formatMessage(messages.openDownloadFile)}</h4>
    <p className="help-sidebar-about-descriptions">{intl.formatMessage(messages.openDownloadFileDescription)}</p>
    <hr />
    <Button variant="outline-primary">{intl.formatMessage(messages.learnMoreButtonTitle)}</Button>
  </HelpSidebar>
);

ExportSidebar.propTypes = {
  intl: intlShape.isRequired,
  courseId: PropTypes.string.isRequired,
};

export default injectIntl(ExportSidebar);

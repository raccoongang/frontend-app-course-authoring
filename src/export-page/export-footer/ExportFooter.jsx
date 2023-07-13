import React from 'react';
import {
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';
import { Button } from '@edx/paragon';
import HelpSidebar from '../../generic/help-sidebar';
import messages from './messages';

const ExportFooter = ({ intl, courseId }) => (
  <div>
    TODO
  </div>
);

ExportFooter.propTypes = {
  intl: intlShape.isRequired,
  courseId: PropTypes.string.isRequired,
};

export default injectIntl(ExportFooter);

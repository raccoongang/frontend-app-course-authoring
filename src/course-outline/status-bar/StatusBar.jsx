import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Hyperlink, Stack } from '@edx/paragon';

import messages from './messages';
import { getPagePath } from '../../utils';

const StatusBar = ({ statusBarData, courseId, onEnableHighlights }) => {
  const intl = useIntl();
  const {
    courseReleaseDate,
    highlightsEnabledForMessaging,
    highlightsDocUrl,
    checklist,
    isSelfPaced,
  } = statusBarData;

  return (
    <Stack direction="horizontal" gap={3.5} className="outline-status-bar">
      <div className="outline-status-bar__item">
        <h5 className="h5">{intl.formatMessage(messages.startDateTitle)}</h5>
        <Hyperlink
          className="small"
          destination={getPagePath(courseId, process.env.ENABLE_NEW_SCHEDULE_DETAILS_PAGE, 'settings/details#schedule')}
          showLaunchIcon={false}
          target="_blank"
        >
          {courseReleaseDate}
        </Hyperlink>
      </div>
      <div className="outline-status-bar__item">
        <h5 className="h5">{intl.formatMessage(messages.pacingTypeTitle)}</h5>
        <span className="small">
          {isSelfPaced
            ? intl.formatMessage(messages.pacingTypeSelfPaced)
            : intl.formatMessage(messages.pacingTypeInstructorPaced)}
        </span>
      </div>
      <div className="outline-status-bar__item">
        <h5 className="h5">{intl.formatMessage(messages.checklistTitle)}</h5>
        <Hyperlink
          className="small"
          target="_blank"
          showLaunchIcon={false}
        >
          0 {intl.formatMessage(messages.checklistCompleted)}
        </Hyperlink>
      </div>
      <div className="outline-status-bar__item">
        <h5 className="h5">{intl.formatMessage(messages.highlightEmailsTitle)}</h5>
        <div className="d-flex align-items-end">
          {highlightsEnabledForMessaging ? (
            <span className="small">{intl.formatMessage(messages.highlightEmailsEnabled)}</span>
          ) : (
            <Button size="sm" onClick={onEnableHighlights}>
              {intl.formatMessage(messages.highlightEmailsButton)}
            </Button>
          )}
          <Hyperlink
            className="small ml-2"
            destination={highlightsDocUrl}
            target="_blank"
            showLaunchIcon={false}
          >
            {intl.formatMessage(messages.highlightEmailsLink)}
          </Hyperlink>
        </div>
      </div>
    </Stack>
  );
};

StatusBar.propTypes = {
  courseId: PropTypes.string.isRequired,
  onEnableHighlights: PropTypes.func.isRequired,
  statusBarData: PropTypes.shape({
    courseReleaseDate: PropTypes.string.isRequired,
    isSelfPaced: PropTypes.bool.isRequired,
    checklist: PropTypes.shape({
      totalCourseLaunchChecks: PropTypes.number.isRequired,
      completedCourseLaunchChecks: PropTypes.number.isRequired,
    }),
    highlightsEnabledForMessaging: PropTypes.bool.isRequired,
    highlightsDocUrl: PropTypes.string.isRequired,
  }).isRequired,
};

export default StatusBar;

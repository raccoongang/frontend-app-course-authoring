import React, { useEffect } from 'react';
import {
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getConfig } from '@edx/frontend-platform';
import { Button } from '@edx/paragon';
import CourseStepper from '../../generic/course-stepper';

import {
  getCurrentStage, getDownloadPath, getError, getSuccessDate,
} from '../data/selectors';
import { fetchExportStatus } from '../data/thunks';
import messages from './messages';
import { EXPORT_STAGES } from '../data/constants';
import { getFormattedSuccessDate } from '../utils';

const ExportStepper = ({ intl, courseId }) => {
  const currentStage = useSelector(getCurrentStage);
  const downloadPath = useSelector(getDownloadPath);
  const successDate = useSelector(getSuccessDate);
  const { msg: errorMessage } = useSelector(getError);
  const dispatch = useDispatch();

  useEffect(() => {
    const id = setInterval(() => {
      if (currentStage === EXPORT_STAGES.SUCCESS || errorMessage) {
        clearInterval(id);
      } else {
        dispatch(fetchExportStatus(courseId));
      }
    }, 3000);
    return () => clearInterval(id);
  });

  return (
    <div>
      <h3>{intl.formatMessage(messages.stepperHeaderTitle)}</h3>
      <hr />
      <CourseStepper
        courseId={courseId}
        steps={[{
          title: intl.formatMessage(messages.stepperPreparingTitle),
          description: intl.formatMessage(messages.stepperPreparingDescription),
          key: EXPORT_STAGES.PREPARING,
        }, {
          title: intl.formatMessage(messages.stepperExportingTitle),
          description: intl.formatMessage(messages.stepperExportingDescription),
          key: EXPORT_STAGES.EXPORTING,
        }, {
          title: intl.formatMessage(messages.stepperCompressingTitle),
          description: intl.formatMessage(messages.stepperCompressingDescription),
          key: EXPORT_STAGES.COMPRESSING,
        }, {
          title: intl.formatMessage(messages.stepperSuccessTitle) + getFormattedSuccessDate(successDate),
          description: intl.formatMessage(messages.stepperSuccessDescription),
          key: EXPORT_STAGES.SUCCESS,
        }]}
        activeKey={currentStage}
        errorMessage={errorMessage}
      />
      {downloadPath && <Button href={`${getConfig().STUDIO_BASE_URL}${downloadPath}`}>{intl.formatMessage(messages.downloadCourseButtonTitle)}</Button>}
    </div>
  );
};

ExportStepper.propTypes = {
  intl: intlShape.isRequired,
  courseId: PropTypes.string.isRequired,
};

export default injectIntl(ExportStepper);

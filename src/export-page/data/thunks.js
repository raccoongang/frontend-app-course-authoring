import Cookies from 'universal-cookie';

import moment from 'moment';
import {
  startCourseExporting,
  getExportStatus,
} from './api';
import {
  updateExportTriggered,
  updateCurrentStage,
  updateDownloadPath,
  updateSuccessDate,
  updateError,
  updateIsErrorModalOpen,
} from './slice';
import { setExportCookie } from '../utils';
import { EXPORT_STAGES, LAST_EXPORT_COOKIE_NAME } from './constants';

export function startExportingCourse(courseId) {
  return async (dispatch) => {
    try {
      dispatch(updateExportTriggered(true));
      const exportData = await startCourseExporting(courseId);
      dispatch(updateCurrentStage(exportData.exportStatus));
      setExportCookie(moment().valueOf(), exportData.exportStatus === EXPORT_STAGES.SUCCESS);

      return true;
    } catch (error) {
      return false;
    }
  };
}

export function fetchExportStatus(courseId) {
  return async (dispatch) => {
    try {
      const { exportStatus, exportOutput, exportError } = await getExportStatus(courseId);
      dispatch(updateCurrentStage(Math.abs(exportStatus)));

      if (exportOutput) {
        dispatch(updateDownloadPath(exportOutput));
        dispatch(updateSuccessDate(moment().valueOf()));
      }

      const cookies = new Cookies();
      const cookieData = cookies.get(LAST_EXPORT_COOKIE_NAME);
      if (!cookieData?.completed) {
        setExportCookie(moment().valueOf(), exportStatus === EXPORT_STAGES.SUCCESS);
      }

      if (exportError) {
        const errorMessage = exportError.rawErrorMsg || exportError;
        const errorUnitUrl = exportError.editUnitUrl || null;
        dispatch(updateError({ msg: errorMessage, unitUrl: errorUnitUrl }));
        dispatch(updateIsErrorModalOpen(true));
      }

      return true;
    } catch (error) {
      return false;
    }
  };
}

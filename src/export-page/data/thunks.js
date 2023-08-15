import Cookies from 'universal-cookie';

import moment from 'moment';

import { setExportCookie } from '../utils';
import { RequestStatus } from '../../data/constants';
import { EXPORT_STAGES, LAST_EXPORT_COOKIE_NAME } from './constants';
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
  reset,
  updateLoadingStatus,
} from './slice';

export function startExportingCourse(courseId) {
  return async (dispatch) => {
    dispatch(updateLoadingStatus({ status: RequestStatus.IN_PROGRESS }));
    try {
      dispatch(reset());
      dispatch(updateExportTriggered(true));
      const exportData = await startCourseExporting(courseId);
      dispatch(updateCurrentStage(exportData.exportStatus));
      setExportCookie(moment().valueOf(), exportData.exportStatus === EXPORT_STAGES.SUCCESS);

      dispatch(updateLoadingStatus({ status: RequestStatus.SUCCESSFUL }));
      return true;
    } catch (error) {
      dispatch(updateLoadingStatus({ status: RequestStatus.FAILED }));
      return false;
    }
  };
}

export function fetchExportStatus(courseId) {
  return async (dispatch) => {
    dispatch(updateLoadingStatus({ status: RequestStatus.IN_PROGRESS }));
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

      dispatch(updateLoadingStatus({ status: RequestStatus.SUCCESSFUL }));
      return true;
    } catch (error) {
      dispatch(updateLoadingStatus({ status: RequestStatus.FAILED }));
      return false;
    }
  };
}

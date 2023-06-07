import { RequestStatus } from '../../data/constants';
import {
  getCourseAdvancedSettings,
  updateCourseAdvancedSettings,
  getProctoringExamErrors,
} from './api';
import {
  fetchCourseAppsSettingsSuccess,
  updateCourseAppsSettingsSuccess,
  updateLoadingStatus,
  updateSavingStatus,
  fetchProctoringExamErrorsSuccess,
  getDataSendErrors,
} from './slice';

export function fetchCourseAppSettings(courseId, settings) {
  return async (dispatch) => {
    dispatch(updateLoadingStatus({ status: RequestStatus.IN_PROGRESS }));

    try {
      const settingValues = await getCourseAdvancedSettings(courseId, settings);
      dispatch(fetchCourseAppsSettingsSuccess(settingValues));
      dispatch(updateLoadingStatus({ status: RequestStatus.SUCCESSFUL }));
    } catch (error) {
      dispatch(updateLoadingStatus({ status: RequestStatus.FAILED }));
    }
  };
}

export function updateCourseAppSetting(courseId, settings) {
  return async (dispatch) => {
    dispatch(updateSavingStatus({ status: RequestStatus.IN_PROGRESS }));

    try {
      const settingValues = await updateCourseAdvancedSettings(courseId, settings);
      dispatch(updateCourseAppsSettingsSuccess(settingValues));
      dispatch(updateSavingStatus({ status: RequestStatus.SUCCESSFUL }));
      return true;
    } catch (error) {
      const errorMsg = error.message;
      const startIndex = errorMsg.indexOf('{');
      const errorJSONData = errorMsg.substring(startIndex);
      const errorArray = JSON.parse(errorJSONData);

      dispatch(getDataSendErrors(errorArray));
      dispatch(updateSavingStatus({ status: RequestStatus.FAILED }));
      return false;
    }
  };
}

export function fetchProctoringExamErrors(courseId) {
  return async (dispatch) => {
    dispatch(updateSavingStatus({ status: RequestStatus.IN_PROGRESS }));

    try {
      const settingValues = await getProctoringExamErrors(courseId);
      dispatch(fetchProctoringExamErrorsSuccess(settingValues));
      return true;
    } catch (error) {
      dispatch(updateSavingStatus({ status: RequestStatus.FAILED }));
      return false;
    }
  };
}

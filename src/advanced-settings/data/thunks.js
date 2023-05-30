import { RequestStatus } from '../../data/constants';
import { addModels, updateModel } from '../../generic/model-store';
import {
  getCourseAdvancedSettings,
  getCourseApps, updateCourseAdvancedSettings,
  updateCourseApp,
  getProctoringErrors,
} from './api';
import {
  fetchCourseAppsSettingsSuccess,
  fetchCourseAppsSuccess,
  updateCourseAppsApiStatus, updateCourseAppsSettingsSuccess,
  updateLoadingStatus,
  updateSavingStatus,
  getProctoredExamErrors,
} from './slice';

/* eslint-disable import/prefer-default-export */
export function fetchCourseApps(courseId) {
  return async (dispatch) => {
    dispatch(updateLoadingStatus({ courseId, status: RequestStatus.IN_PROGRESS }));

    try {
      const courseApps = await getCourseApps(courseId);

      dispatch(addModels({ modelType: 'courseApps', models: courseApps }));
      dispatch(fetchCourseAppsSuccess({
        courseAppIds: courseApps.map(courseApp => courseApp.id),
      }));
      dispatch(updateLoadingStatus({ courseId, status: RequestStatus.SUCCESSFUL }));
    } catch (error) {
      if (error.response && error.response.status === 403) {
        dispatch(updateCourseAppsApiStatus({ status: RequestStatus.DENIED }));
      }

      dispatch(updateLoadingStatus({ courseId, status: RequestStatus.FAILED }));
    }
  };
}

export function updateAppStatus(courseId, appId, state) {
  return async (dispatch) => {
    dispatch(updateSavingStatus({ status: RequestStatus.IN_PROGRESS }));

    try {
      await updateCourseApp(courseId, appId, state);
      dispatch(updateModel({ modelType: 'courseApps', model: { id: appId, enabled: state } }));
      dispatch(updateSavingStatus({ status: RequestStatus.SUCCESSFUL }));
      return true;
    } catch (error) {
      dispatch(updateSavingStatus({ status: RequestStatus.FAILED }));
      return false;
    }
  };
}

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
  // console.log('settings', settings);
  return async (dispatch) => {
    dispatch(updateSavingStatus({ status: RequestStatus.IN_PROGRESS }));

    try {
      const settingValues = await updateCourseAdvancedSettings(courseId, settings);
      dispatch(updateCourseAppsSettingsSuccess(settingValues));
      dispatch(updateSavingStatus({ status: RequestStatus.SUCCESSFUL }));
      return true;
    } catch (error) {
      dispatch(updateSavingStatus({ status: RequestStatus.FAILED }));
      return false;
    }
  };
}

export function getProctoredExamsErrors(courseId) {
  return async (dispatch) => {
    dispatch(updateSavingStatus({ status: RequestStatus.IN_PROGRESS }));

    try {
      const settingValues = await getProctoringErrors(courseId);
      dispatch(getProctoredExamErrors(settingValues));
      return true;
    } catch (error) {
      dispatch(updateSavingStatus({ status: RequestStatus.FAILED }));
      return false;
    }
  };
}

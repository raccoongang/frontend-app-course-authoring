import { configureStore } from '@reduxjs/toolkit';
import {
  reducer,
  fetchCourseAppsSuccess,
  updateLoadingStatus,
  updateSavingStatus,
  updateCourseAppsApiStatus,
  fetchCourseAppsSettingsSuccess,
  updateCourseAppsSettingsSuccess,
} from './slice';

describe('Advanced Settings Slice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        advancedSettings: reducer,
      },
    });
  });

  describe('fetchCourseAppsSuccess', () => {
    it('updates the courseAppIds in the state', () => {
      const courseAppIds = [1, 2, 3];
      store.dispatch(fetchCourseAppsSuccess({ courseAppIds }));
      const { courseAppIds: updatedCourseAppIds } = store.getState().advancedSettings;
      expect(updatedCourseAppIds).toEqual(courseAppIds);
    });
  });

  describe('updateLoadingStatus', () => {
    it('updates the loadingStatus in the state', () => {
      const loadingStatus = 'complete';
      store.dispatch(updateLoadingStatus({ status: loadingStatus }));
      const { loadingStatus: updatedLoadingStatus } = store.getState().advancedSettings;
      expect(updatedLoadingStatus).toEqual(loadingStatus);
    });
  });

  describe('updateSavingStatus', () => {
    it('updates the savingStatus in the state', () => {
      const savingStatus = 'saving';
      store.dispatch(updateSavingStatus({ status: savingStatus }));
      const { savingStatus: updatedSavingStatus } = store.getState().advancedSettings;
      expect(updatedSavingStatus).toEqual(savingStatus);
    });
  });

  describe('updateCourseAppsApiStatus', () => {
    it('updates the courseAppsApiStatus in the state', () => {
      const courseAppsApiStatus = { api1: 'success', api2: 'error' };
      store.dispatch(updateCourseAppsApiStatus({ status: courseAppsApiStatus }));
      const { courseAppsApiStatus: updatedCourseAppsApiStatus } = store.getState().advancedSettings;
      expect(updatedCourseAppsApiStatus).toEqual(courseAppsApiStatus);
    });
  });

  describe('fetchCourseAppsSettingsSuccess', () => {
    it('merges the course app settings into the state', () => {
      const courseAppSettings = { setting1: { value: 'value1' }, setting2: { value: 'value2' } };
      store.dispatch(fetchCourseAppsSettingsSuccess(courseAppSettings));
      const { courseAppSettings: updatedCourseAppSettings } = store.getState().advancedSettings;
      expect(updatedCourseAppSettings).toEqual(courseAppSettings);
    });
  });

  describe('updateCourseAppsSettingsSuccess', () => {
    it('merges the updated course app settings into the state', () => {
      const updatedCourseAppSettings = { setting1: { value: 'updatedValue1' } };
      store.dispatch(updateCourseAppsSettingsSuccess(updatedCourseAppSettings));
      const { courseAppSettings: updatedCourseAppSettingsState } = store.getState().advancedSettings;
      expect(updatedCourseAppSettingsState).toEqual({
        setting1: { value: 'updatedValue1' },
      });
    });
  });
});

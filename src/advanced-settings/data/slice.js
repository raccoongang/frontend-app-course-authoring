/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { RequestStatus } from '../../data/constants';

const slice = createSlice({
  name: 'advancedSettings',
  initialState: {
    courseAppIds: [],
    loadingStatus: RequestStatus.IN_PROGRESS,
    savingStatus: '',
    courseAppsApiStatus: {},
    courseAppSettings: {},
    proctoredErrors: {},
  },
  reducers: {
    fetchCourseAppsSuccess: (state, { payload }) => {
      state.courseAppIds = payload.courseAppIds;
    },
    updateLoadingStatus: (state, { payload }) => {
      state.loadingStatus = payload.status;
    },
    updateSavingStatus: (state, { payload }) => {
      state.savingStatus = payload.status;
    },
    updateCourseAppsApiStatus: (state, { payload }) => {
      state.courseAppsApiStatus = payload.status;
    },
    fetchCourseAppsSettingsSuccess: (state, { payload }) => {
      Object.assign(state.courseAppSettings, payload);
    },
    updateCourseAppsSettingsSuccess: (state, { payload }) => {
      Object.assign(state.courseAppSettings, payload);
    },
    getProctoredExamErrors: (state, { payload }) => {
      Object.assign(state.proctoredErrors, payload);
    },
  },
});

export const {
  fetchCourseAppsSuccess,
  updateLoadingStatus,
  updateSavingStatus,
  updateCourseAppsApiStatus,
  fetchCourseAppsSettingsSuccess,
  updateCourseAppsSettingsSuccess,
  getProctoredExamErrors,
} = slice.actions;

export const {
  reducer,
} = slice;

/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { RequestStatus } from '../../data/constants';

const slice = createSlice({
  name: 'courseOutline',
  initialState: {
    loadingOutlineIndexStatus: RequestStatus.IN_PROGRESS,
    outlineIndexData: {},
    statusBarData: {
      courseReleaseDate: '',
      highlightsEnabledForMessaging: false,
      highlightsDocUrl: '',
      isSelfPaced: false,
      checklist: {
        totalCourseLaunchChecks: 0,
        completedCourseLaunchChecks: 0,
      },
    },
  },
  reducers: {
    fetchOutlineIndexSuccess: (state, { payload }) => {
      state.outlineIndexData = payload;

      state.statusBarData.courseReleaseDate = payload.courseReleaseDate;
      state.statusBarData.highlightsEnabledForMessaging = payload.courseStructure.highlightsEnabledForMessaging;
      state.statusBarData.highlightsDocUrl = payload.courseStructure.highlightsDocUrl;
    },
    updateLoadingOutlineIndexStatus: (state, { payload }) => {
      state.loadingOutlineIndexStatus = payload.status;
    },
    fetchStatusBarSuccess: (state, { payload }) => {
      state.checklist.totalCourseLaunchChecks = payload.totalCourseLaunchChecks;
      state.checklist.completedCourseLaunchChecks = payload.completedCourseLaunchChecks;
    },
  },
});

export const {
  fetchOutlineIndexSuccess,
  updateLoadingOutlineIndexStatus,
  fetchStatusBarSuccess,
} = slice.actions;

export const {
  reducer,
} = slice;

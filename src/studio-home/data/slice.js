/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { RequestStatus } from '../../data/constants';

const slice = createSlice({
  name: 'studioHome',
  initialState: {
    loadingStatus: RequestStatus.IN_PROGRESS,
    savingStatus: '',
    studioHomeData: {},
    organizations: [],
    newCourseData: {},
    postErrors: {},
  },
  reducers: {
    updateLoadingStatus: (state, { payload }) => {
      state.loadingStatus = payload.status;
    },
    updateSavingStatus: (state, { payload }) => {
      state.savingStatus = payload.status;
    },
    updateNewCourseData: (state, { payload }) => {
      state.newCourseData = payload;
    },
    updatePostErrors: (state, { payload }) => {
      state.postErrors = payload;
    },
    fetchStudioHomeDataSuccess: (state, { payload }) => {
      Object.assign(state.studioHomeData, payload);
    },
    fetchOrganizations: (state, { payload }) => {
      Object.assign(state.organizations, payload);
    },
  },
});

export const {
  updatePostErrors,
  updateLoadingStatus,
  updateSavingStatus,
  updateNewCourseData,
  fetchStudioHomeDataSuccess,
  fetchOrganizations,
} = slice.actions;

export const {
  reducer,
} = slice;

/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { RequestStatus } from '../../data/constants';

const slice = createSlice({
  name: 'studioHome',
  initialState: {
    loadingStatus: RequestStatus.IN_PROGRESS,
    savingStatus: '',
    studioHomeData: {},
  },
  reducers: {
    updateLoadingStatus: (state, { payload }) => {
      state.loadingStatus = payload.status;
    },
    updateSavingStatus: (state, { payload }) => {
      state.savingStatus = payload.status;
    },
    fetchStudioHomeDataSuccess: (state, { payload }) => {
      Object.assign(state.studioHomeData, payload);
    },
  },
});

export const {
  updateLoadingStatus,
  updateSavingStatus,
  fetchStudioHomeDataSuccess,
} = slice.actions;

export const {
  reducer,
} = slice;

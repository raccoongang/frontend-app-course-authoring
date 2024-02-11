/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { RequestStatus } from '../../data/constants';

const slice = createSlice({
  name: 'groupConfigurations',
  initialState: {
    savingStatuses: {
      createContentGroupStatus: '',
      editContentGroupStatus: '',
      deleteContentGroupStatus: '',
    },
    loadingStatus: RequestStatus.IN_PROGRESS,
    groupConfigurations: {},
  },
  reducers: {
    fetchGroupConfigurations: (state, { payload }) => {
      state.groupConfigurations = payload.groupConfigurations;
    },
    updateLoadingStatus: (state, { payload }) => {
      state.loadingStatus = payload.status;
    },
    updateSavingStatuses: (state, { payload }) => {
      state.savingStatuses = { ...state.savingStatuses, ...payload };
    },
  },
});

export const {
  fetchGroupConfigurations,
  updateLoadingStatus,
  updateSavingStatuses,
  updateContentGroup,
} = slice.actions;

export const { reducer } = slice;

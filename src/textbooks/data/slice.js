/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { RequestStatus } from '../../data/constants';

const slice = createSlice({
  name: 'textbooks',
  initialState: {
    loadingStatus: RequestStatus.IN_PROGRESS,
    textbooks: [],
  },
  reducers: {
    fetchTextbooks: (state, { payload }) => {
      state.textbooks = payload.textbooks;
    },
    updateLoadingStatus: (state, { payload }) => {
      state.loadingStatus = payload.status;
    },
  },
});

export const {
  fetchTextbooks,
  updateLoadingStatus,
} = slice.actions;

export const { reducer } = slice;

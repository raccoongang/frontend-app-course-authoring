/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { RequestStatus } from '../../data/constants';

const slice = createSlice({
  name: 'textbooks',
  initialState: {
    savingStatus: '',
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
    updateSavingStatus: (state, { payload }) => {
      state.savingStatus = payload.status;
    },
    createTextbookSuccess: (state, { payload }) => {
      state.textbooks = [...state.textbooks, payload];
    },
  },
});

export const {
  fetchTextbooks,
  updateLoadingStatus,
  updateSavingStatus,
  createTextbookSuccess,
} = slice.actions;

export const { reducer } = slice;

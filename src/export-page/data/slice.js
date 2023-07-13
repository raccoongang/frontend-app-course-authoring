/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'exportPage',
  initialState: {
    exportTriggered: false,
    currentStage: 0,
    error: { msg: null, unitUrl: null },
    downloadPath: null,
    successDate: null,
    isErrorModalOpen: false,
  },
  reducers: {
    updateExportTriggered: (state, { payload }) => {
      state.exportTriggered = payload;
    },
    updateCurrentStage: (state, { payload }) => {
      state.currentStage = payload;
    },
    updateDownloadPath: (state, { payload }) => {
      state.downloadPath = payload;
    },
    updateSuccessDate: (state, { payload }) => {
      state.successDate = payload;
    },
    updateError: (state, { payload }) => {
      state.error = payload;
    },
    updateIsErrorModalOpen: (state, { payload }) => {
      state.isErrorModalOpen = payload;
    },
  },
});

export const {
  updateExportTriggered,
  updateCurrentStage,
  updateDownloadPath,
  updateSuccessDate,
  updateError,
  updateIsErrorModalOpen,
} = slice.actions;

export const {
  reducer,
} = slice;

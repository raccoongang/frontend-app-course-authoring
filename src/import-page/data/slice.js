/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentStage: 0,
  error: { hasError: false, message: '' },
  progress: 0,
  importTriggered: false,
  fileName: null,
  loadingStatus: '',
  savingStatus: '',
};

const slice = createSlice({
  name: 'importPage',
  initialState,
  reducers: {
    updateCurrentStage: (state, { payload }) => {
      state.currentStage = payload;
    },
    updateError: (state, { payload }) => {
      state.error = { ...state.error, ...payload };
    },
    updateProgress: (state, { payload }) => {
      state.progress = payload;
    },
    updateImportTriggered: (state, { payload }) => {
      state.importTriggered = payload;
    },
    updateFileName: (state, { payload }) => {
      state.fileName = payload;
    },
    reset: () => initialState,
    updateLoadingStatus: (state, { payload }) => {
      state.loadingStatus = payload;
    },
    updateSavingStatus: (state, { payload }) => {
      state.savingStatus = payload;
    },
  },
});

export const {
  updateCurrentStage,
  updateError,
  updateProgress,
  updateImportTriggered,
  updateFileName,
  reset,
  updateLoadingStatus,
  updateSavingStatus,
} = slice.actions;

export const {
  reducer,
} = slice;

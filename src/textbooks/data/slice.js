/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { RequestStatus } from '../../data/constants';

const slice = createSlice({
  name: 'textbooks',
  initialState: {
    savingStatus: '',
    loadingStatus: RequestStatus.IN_PROGRESS,
    textbooks: [],
    currentTextbookId: '',
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
    editTextbookSuccess: (state, { payload }) => {
      state.currentTextbookId = payload.id;
      state.textbooks = state.textbooks.map((textbook) => {
        if (textbook.id === payload.id) {
          return payload;
        }
        return textbook;
      });
    },
  },
});

export const {
  fetchTextbooks,
  updateLoadingStatus,
  updateSavingStatus,
  createTextbookSuccess,
  editTextbookSuccess,
} = slice.actions;

export const { reducer } = slice;

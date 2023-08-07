/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { RequestStatus } from '../../data/constants';

const initialState = {
  loadingHelpTokensStatus: RequestStatus.PENDING,
  pages: {},
  locales: {},
};

const slice = createSlice({
  name: 'helpTokens',
  initialState,
  reducers: {
    updatePages: (state, { payload }) => {
      state.pages = payload;
    },
    updateLocales: (state, { payload }) => {
      state.locales = payload;
    },
    updateLoadingHelpTokensStatus: (state, { payload }) => {
      state.loadingHelpTokensStatus = payload.status;
    },
  },
});

export const {
  updatePages,
  updateLocales,
  updateLoadingHelpTokensStatus,
} = slice.actions;

export const {
  reducer,
} = slice;

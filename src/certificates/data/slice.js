/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { fetchCertificates } from './thunks';
import { RequestStatus } from '../../data/constants';

const slice = createSlice({
  name: 'certificates',
  initialState: {
    loadingStatus: RequestStatus.PENDING,
    savingStatus: '',
    certificatesData: {},
  },
  reducers: {
    updateSavingStatus: (state, { payload }) => {
      state.savingStatus = payload.status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCertificates.pending, (state) => {
        state.loadingStatus = RequestStatus.IN_PROGRESS;
      })
      .addCase(fetchCertificates.fulfilled, (state, action) => {
        state.certificatesData = action.payload;
        state.loadingStatus = RequestStatus.SUCCESSFUL;
      })
      .addCase(fetchCertificates.rejected, (state, action) => {
        state.loadingStatus = action.payload.status;
      });
  },
});

export const { updateSavingStatus } = slice.actions;

export const { reducer } = slice;

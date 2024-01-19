/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

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
    updateLoadingStatus: (state, { payload }) => {
      state.loadingStatus = payload.status;
    },
    fetchCertificatesSuccess: (state, { payload }) => {
      Object.assign(state.certificatesData, payload);
    },
  },
});

export const {
  updateSavingStatus,
  updateLoadingStatus,
  fetchCertificatesSuccess,
} = slice.actions;

export const { reducer } = slice;

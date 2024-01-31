/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { RequestStatus } from '../../data/constants';
import { MODE_STATES } from './constants';

const slice = createSlice({
  name: 'certificates',
  initialState: {
    certificatesData: {},
    mode: MODE_STATES.NO_MODES,
    loadingStatus: RequestStatus.PENDING,
    savingStatus: '',
    sendRequestErrors: {},
  },
  reducers: {
    updateSavingStatus: (state, { payload }) => {
      state.savingStatus = payload.status;
    },
    updateLoadingStatus: (state, { payload }) => {
      state.loadingStatus = payload.status;
    },
    getDataSendErrors: (state, { payload }) => {
      Object.assign(state.sendRequestErrors, payload);
    },
    fetchCertificatesSuccess: (state, { payload }) => {
      Object.assign(state.certificatesData, payload);
    },
    createCertificateSuccess: (state, action) => {
      const index = state.certificatesData.certificates.findIndex(c => c.id === action.payload.id);

      state.certificatesData.certificates = index !== -1
        ? state.certificatesData.certificates.map(
          (certificate, idx) => (idx === index ? action.payload : certificate),
        )
        : [...state.certificatesData.certificates, action.payload];
    },
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    deleteCertificateSuccess: (state) => {
      state.certificatesData.certificates = [];
    },
  },
});

export const {
  setMode,
  getDataSendErrors,
  updateSavingStatus,
  updateLoadingStatus,
  fetchCertificatesSuccess,
  createCertificateSuccess,
  deleteCertificateSuccess,
} = slice.actions;

export const { reducer } = slice;

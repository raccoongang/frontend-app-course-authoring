import { createSelector } from '@reduxjs/toolkit';

export const getLoadingStatus = (state) => state.certificates.loadingStatus;
export const getSavingStatus = (state) => state.certificates.savingStatus;
export const getCertificates = state => state.certificates.certificatesData.certificates;
export const getHasCertificateModes = state => state.certificates.certificatesData.hasCertificateModes;

export const getHasCertificates = createSelector(
  [getCertificates],
  (certificates) => certificates && certificates.length > 0,
);

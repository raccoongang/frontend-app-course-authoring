/* eslint-disable import/prefer-default-export */
import { RequestStatus } from '../../data/constants';
import { getCertificates } from './api';
import { fetchCertificatesSuccess, updateLoadingStatus } from './slice';

export function fetchCertificates(courseId) {
  return async (dispatch) => {
    dispatch(updateLoadingStatus({ status: RequestStatus.IN_PROGRESS }));

    try {
      const certificates = await getCertificates(courseId);

      dispatch(fetchCertificatesSuccess(certificates));
      dispatch(updateLoadingStatus({ status: RequestStatus.SUCCESSFUL }));
    } catch (error) {
      if (error.response && error.response.status === 403) {
        dispatch(updateLoadingStatus({ courseId, status: RequestStatus.DENIED }));
      } else {
        dispatch(updateLoadingStatus({ courseId, status: RequestStatus.FAILED }));
      }
    }
  };
}

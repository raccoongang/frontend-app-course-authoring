import { RequestStatus } from '../../data/constants';
import {
  hideProcessingNotification,
  showProcessingNotification,
} from '../../generic/processing-notification/data/slice';
import { NOTIFICATION_MESSAGES } from '../../constants';
import { getCertificates, createCertificate, deleteCertificate } from './api';
import {
  fetchCertificatesSuccess,
  updateLoadingStatus,
  updateSavingStatus,
  createCertificateSuccess,
  deleteCertificateSuccess,
} from './slice';

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

export function createCourseCertificate(courseId, certificates) {
  return async (dispatch) => {
    dispatch(updateSavingStatus({ status: RequestStatus.PENDING }));
    dispatch(showProcessingNotification(NOTIFICATION_MESSAGES.saving));

    try {
      const certificatesValues = await createCertificate(courseId, certificates);
      dispatch(createCertificateSuccess(certificatesValues));
      dispatch(updateSavingStatus({ status: RequestStatus.SUCCESSFUL }));
      return true;
    } catch (error) {
      dispatch(updateSavingStatus({ status: RequestStatus.FAILED }));
      return false;
    } finally {
      dispatch(hideProcessingNotification());
    }
  };
}

export function deleteCourseCertificate(courseId, certificateId) {
  return async (dispatch) => {
    dispatch(updateSavingStatus({ status: RequestStatus.PENDING }));
    dispatch(showProcessingNotification(NOTIFICATION_MESSAGES.deleting));

    try {
      const certificatesValues = await deleteCertificate(courseId, certificateId);
      dispatch(deleteCertificateSuccess(certificatesValues));
      dispatch(hideProcessingNotification());
      dispatch(updateSavingStatus({ status: RequestStatus.SUCCESSFUL }));
      return true;
    } catch (error) {
      dispatch(hideProcessingNotification());
      let errorData;
      try {
        const { customAttributes: { httpErrorResponseData } } = error;
        errorData = JSON.parse(httpErrorResponseData);
      } catch (err) {
        errorData = {};
        dispatch(getDataSendErrors(errorData));
        dispatch(updateSavingStatus({ status: RequestStatus.FAILED }));
      }
      return false;
    }
  };
}

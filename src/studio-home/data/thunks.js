import { RequestStatus } from '../../data/constants';
import { createNewCourse, getOrganizations, getStudioHomeData } from './api';
import {
  fetchOrganizations,
  fetchStudioHomeDataSuccess,
  updatePostErrors,
  updateLoadingStatus,
  updateNewCourseData,
  updateSavingStatus,
} from './slice';

export function fetchStudioHomeData() {
  return async (dispatch) => {
    dispatch(updateLoadingStatus({ status: RequestStatus.IN_PROGRESS }));

    try {
      const studioHomeData = await getStudioHomeData();
      dispatch(fetchStudioHomeDataSuccess(studioHomeData));
      dispatch(updateLoadingStatus({ status: RequestStatus.SUCCESSFUL }));
    } catch (error) {
      dispatch(updateLoadingStatus({ status: RequestStatus.FAILED }));
    }
  };
}

export function fetchOrganizationsQuery() {
  return async (dispatch) => {
    try {
      const organizations = await getOrganizations();
      dispatch(fetchOrganizations(organizations));
    } catch (error) {
      dispatch(updateLoadingStatus({ status: RequestStatus.FAILED }));
    }
  };
}

export function createNewCourseQuery(newCourseData) {
  return async (dispatch) => {
    dispatch(updateSavingStatus({ status: RequestStatus.IN_PROGRESS }));

    try {
      const response = await createNewCourse(newCourseData);
      dispatch(updateNewCourseData('url' in response ? response : {}));
      dispatch(updatePostErrors('errMsg' in response ? response : {}));
      dispatch(updateSavingStatus({ status: RequestStatus.SUCCESSFUL }));
      return true;
    } catch (error) {
      dispatch(updateSavingStatus({ status: RequestStatus.FAILED }));
      return false;
    }
  };
}

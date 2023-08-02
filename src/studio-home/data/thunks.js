import { RequestStatus } from '../../data/constants';
import { getStudioHomeData } from './api';
import {
  fetchStudioHomeDataSuccess,
  updateLoadingStatus,
} from './slice';

// eslint-disable-next-line import/prefer-default-export
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

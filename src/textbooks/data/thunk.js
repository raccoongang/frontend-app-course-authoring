import { RequestStatus } from '../../data/constants';
import { fetchTextbooks, updateLoadingStatus } from './slice';
import { getTextbooks } from './api';

// eslint-disable-next-line import/prefer-default-export
export function fetchTextbooksQuery(courseId) {
  return async (dispatch) => {
    dispatch(updateLoadingStatus({ status: RequestStatus.IN_PROGRESS }));

    try {
      const { textbooks } = await getTextbooks(courseId);
      dispatch(fetchTextbooks({ textbooks }));
      dispatch(updateLoadingStatus({ status: RequestStatus.SUCCESSFUL }));
    } catch (error) {
      dispatch(updateLoadingStatus({ status: RequestStatus.FAILED }));
    }
  };
}

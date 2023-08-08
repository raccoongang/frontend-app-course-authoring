import { RequestStatus } from '../../data/constants';
import {
  getCourseOutlineIndex,
  getReindexCourse,
} from './api';
import {
  fetchOutlineIndexSuccess,
  updateLoadingOutlineIndexStatus,
} from './slice';

export function fetchCourseOutlineIndexQuery(courseId) {
  return async (dispatch) => {
    dispatch(updateLoadingOutlineIndexStatus({ status: RequestStatus.IN_PROGRESS }));

    try {
      const outlineIndex = await getCourseOutlineIndex(courseId);
      dispatch(fetchOutlineIndexSuccess(outlineIndex));

      dispatch(updateLoadingOutlineIndexStatus({ status: RequestStatus.SUCCESSFUL }));
      return true;
    } catch (error) {
      dispatch(updateLoadingOutlineIndexStatus({ status: RequestStatus.FAILED }));
      return false;
    }
  };
}

export function fetchCourseReindexQuery(courseId, reindexLink) {
  return async (dispatch) => {
    try {
      await getReindexCourse(reindexLink);
      dispatch(fetchCourseOutlineIndexQuery(courseId));

      return true;
    } catch (error) {
      return false;
    }
  };
}

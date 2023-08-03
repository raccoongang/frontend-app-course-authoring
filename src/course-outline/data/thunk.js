import {
  getCourseBestPractices,
  getCourseLaunch,
  getCourseOutlineIndex,
} from './api';
import {
  fetchOutlineIndexSuccess,
  updateLoadingOutlineIndexStatus,
  fetchStatusBarSuccess,
} from './slice';
import { RequestStatus } from '../../data/constants';
import { getCourseLaunchChecklist } from '../utils/utils';

// eslint-disable-next-line import/prefer-default-export
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

export function fetchCourseBestPracticesQuery({
  courseId,
  excludeGraded = true,
  all = true,
}) {
  return async (dispatch) => {
    try {
      const data = await getCourseBestPractices({ courseId, excludeGraded, all });

      return true;
    } catch (error) {
      return false;
    }
  };
}

export function fetchCourseLaunchQuery({
  courseId,
  gradedOnly = true,
  validateOras = true,
  all = true,
}) {
  return async (dispatch) => {
    try {
      const data = await getCourseLaunch({
        courseId, gradedOnly, validateOras, all,
      });
      dispatch(fetchStatusBarSuccess(getCourseLaunchChecklist(data)));

      return true;
    } catch (error) {
      return false;
    }
  };
}

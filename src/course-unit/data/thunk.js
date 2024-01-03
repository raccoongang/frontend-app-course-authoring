import { getCourseUnit, editUnitDisplayName } from './api';
import {
  updateLoadingCourseUnitStatus,
  fetchCourseItemSuccess,
  updateSavingStatus,
} from './slice';
import { RequestStatus } from '../../data/constants';
import { NOTIFICATION_MESSAGES } from '../../constants';
import {
  hideProcessingNotification,
  showProcessingNotification,
} from '../../generic/processing-notification/data/slice';


export function fetchCourseUnitQuery(courseId) {
  return async (dispatch) => {
    dispatch(updateLoadingCourseUnitStatus({ status: RequestStatus.IN_PROGRESS }));

    try {
      const courseUnit = await getCourseUnit(courseId);
      dispatch(fetchCourseItemSuccess(courseUnit));
      dispatch(updateLoadingCourseUnitStatus({ status: RequestStatus.SUCCESSFUL }));
      return true;
    } catch (error) {
      dispatch(updateLoadingCourseUnitStatus({ status: RequestStatus.FAILED }));
      return false;
    }
  };
}

export function editCourseItemQuery(itemId, displayName) {
  return async (dispatch) => {
    dispatch(updateSavingStatus({ status: RequestStatus.PENDING }));
    dispatch(showProcessingNotification(NOTIFICATION_MESSAGES.saving));

    try {
      await editUnitDisplayName(itemId, displayName).then(async (result) => {
        if (result) {
          const courseUnit = await getCourseUnit(itemId);
          dispatch(fetchCourseItemSuccess(courseUnit));
          dispatch(hideProcessingNotification());
          dispatch(updateSavingStatus({ status: RequestStatus.SUCCESSFUL }));
        }
      });
    } catch (error) {
      dispatch(hideProcessingNotification());
      dispatch(updateSavingStatus({ status: RequestStatus.FAILED }));
    }
  };
}

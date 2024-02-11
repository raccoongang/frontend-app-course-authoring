import { RequestStatus } from '../../data/constants';
import { NOTIFICATION_MESSAGES } from '../../constants';
import {
  hideProcessingNotification,
  showProcessingNotification,
} from '../../generic/processing-notification/data/slice';
import {
  getGroupConfigurations,
  createContentGroup,
  editContentGroup,
  deleteContentGroup,
} from './api';
import {
  fetchGroupConfigurations,
  updateLoadingStatus,
  updateSavingStatuses,
} from './slice';

export function fetchGroupConfigurationsQuery(courseId) {
  return async (dispatch) => {
    dispatch(updateLoadingStatus({ status: RequestStatus.IN_PROGRESS }));

    try {
      const groupConfigurations = await getGroupConfigurations(courseId);
      dispatch(fetchGroupConfigurations({ groupConfigurations }));
      dispatch(updateLoadingStatus({ status: RequestStatus.SUCCESSFUL }));
    } catch (error) {
      dispatch(updateLoadingStatus({ status: RequestStatus.FAILED }));
    }
  };
}

export function createContentGroupQuery(courseId, group) {
  return async (dispatch) => {
    dispatch(updateSavingStatuses({ createContentGroupStatus: RequestStatus.PENDING }));
    dispatch(showProcessingNotification(NOTIFICATION_MESSAGES.saving));

    try {
      await createContentGroup(courseId, group);
      dispatch(hideProcessingNotification());
      dispatch(
        updateSavingStatuses({
          createContentGroupStatus: RequestStatus.SUCCESSFUL,
        }),
      );
      return true;
    } catch (error) {
      dispatch(hideProcessingNotification());
      dispatch(
        updateSavingStatuses({ createContentGroupStatus: RequestStatus.FAILED }),
      );
      return false;
    }
  };
}

export function editContentGroupQuery(courseId, group) {
  return async (dispatch) => {
    dispatch(updateSavingStatuses({ editContentGroupStatus: RequestStatus.PENDING }));
    dispatch(showProcessingNotification(NOTIFICATION_MESSAGES.saving));

    try {
      await editContentGroup(courseId, group);
      dispatch(hideProcessingNotification());
      dispatch(
        updateSavingStatuses({
          editContentGroupStatus: RequestStatus.SUCCESSFUL,
        }),
      );
      return true;
    } catch (error) {
      dispatch(hideProcessingNotification());
      dispatch(
        updateSavingStatuses({ editContentGroupStatus: RequestStatus.FAILED }),
      );
      return false;
    }
  };
}

export function deleteContentGroupQuery(courseId, parentGroupId, groupId) {
  return async (dispatch) => {
    dispatch(updateSavingStatuses({ deleteContentGroupStatus: RequestStatus.PENDING }));
    dispatch(showProcessingNotification(NOTIFICATION_MESSAGES.deleting));

    try {
      await deleteContentGroup(courseId, parentGroupId, groupId);
      dispatch(hideProcessingNotification());
      dispatch(
        updateSavingStatuses({
          deleteContentGroupStatus: RequestStatus.SUCCESSFUL,
        }),
      );
    } catch (error) {
      dispatch(hideProcessingNotification());
      dispatch(
        updateSavingStatuses({ deleteContentGroupStatus: RequestStatus.FAILED }),
      );
    }
  };
}

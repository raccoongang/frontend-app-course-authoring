import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getProcessingNotification } from '../generic/processing-notification/data/selectors';
import { RequestStatus } from '../data/constants';
import {
  fetchGroupConfigurationsQuery,
  createContentGroupQuery,
  editContentGroupQuery,
  deleteContentGroupQuery,
} from './data/thunk';
import { updateSavingStatuses } from './data/slice';
import {
  getGroupConfigurationsData,
  getLoadingStatus,
  getSavingStatuses,
} from './data/selectors';

const useGroupConfigurations = (courseId) => {
  const dispatch = useDispatch();
  const groupConfigurations = useSelector(getGroupConfigurationsData);
  const loadingStatus = useSelector(getLoadingStatus);
  const {
    createContentGroupStatus,
    editContentGroupStatus,
    deleteContentGroupStatus,
  } = useSelector(getSavingStatuses);
  const {
    isShow: isShowProcessingNotification,
    title: processingNotificationTitle,
  } = useSelector(getProcessingNotification);

  const handleInternetConnectionFailed = () => {
    dispatch(
      updateSavingStatuses({
        editContentGroupStatus: RequestStatus.FAILED,
        createContentGroupStatus: RequestStatus.FAILED,
        deleteContentGroupStatus: RequestStatus.FAILED,
      }),
    );
  };

  const groupConfigurationsActions = {
    handleCreateContentGroup: (group, callbackToClose) => {
      dispatch(createContentGroupQuery(courseId, group)).then((result) => {
        if (result) {
          callbackToClose();
        }
      });
    },
    handleEditContentGroup: (group, callbackToClose) => {
      dispatch(editContentGroupQuery(courseId, group)).then((result) => {
        if (result) {
          callbackToClose();
        }
      });
    },
    handleDeleteContentGroup: (parentGroupId, groupId) => {
      dispatch(deleteContentGroupQuery(courseId, parentGroupId, groupId));
    },
  };
  const anyQueryIsSucceed = [
    createContentGroupStatus,
    editContentGroupStatus,
    deleteContentGroupStatus,
  ].includes(RequestStatus.SUCCESSFUL);
  const anyQueryIsPending = [
    createContentGroupStatus,
    editContentGroupStatus,
    deleteContentGroupStatus,
  ].includes(RequestStatus.PENDING);
  const anyQueryIsFailed = [
    createContentGroupStatus,
    editContentGroupStatus,
    deleteContentGroupStatus,
  ].includes(RequestStatus.FAILED);

  useEffect(() => {
    if (anyQueryIsSucceed) {
      dispatch(fetchGroupConfigurationsQuery(courseId));
      dispatch(
        updateSavingStatuses({
          editContentGroupStatus: '',
          createContentGroupStatus: '',
          deleteContentGroupStatus: '',
        }),
      );
    }
  }, [
    createContentGroupStatus,
    editContentGroupStatus,
    deleteContentGroupStatus,
  ]);
  useEffect(() => {
    dispatch(fetchGroupConfigurationsQuery(courseId));
  }, [courseId]);

  return {
    anyQueryIsPending,
    anyQueryIsFailed,
    isLoading: loadingStatus === RequestStatus.IN_PROGRESS,
    groupConfigurationsActions,
    groupConfigurations,
    isShowProcessingNotification,
    processingNotificationTitle,
    handleInternetConnectionFailed,
  };
};

// eslint-disable-next-line import/prefer-default-export
export { useGroupConfigurations };

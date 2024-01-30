import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { RequestStatus } from '../data/constants';
import {
  createNewCourseXBlock,
  fetchCourseUnitQuery,
  editCourseItemQuery,
  fetchCourseSectionVerticalData,
  fetchCourseVerticalChildrenData,
  deleteUnitItemQuery,
  duplicateUnitItemQuery,
} from './data/thunk';
import {
  getCourseSectionVertical,
  getCourseVerticalChildren,
  getCourseUnitData,
  getLoadingStatus,
  getSavingStatus,
  getSequenceStatus,
  getClipboardData,
  getCourseUnitEnableCopyPaste, getStaticFileNotices,
} from './data/selectors';
import { changeEditTitleFormOpen, updateQueryPendingStatus } from './data/slice';
import usePastNotificationAlerts from './paste-notifications/usePasteNotificationAlert';

// eslint-disable-next-line import/prefer-default-export
export const useCourseUnit = ({ courseId, blockId }) => {
  const dispatch = useDispatch();

  const [isErrorAlert, toggleErrorAlert] = useState(false);
  const [hasInternetConnectionError, setInternetConnectionError] = useState(false);
  const courseUnit = useSelector(getCourseUnitData);
  const savingStatus = useSelector(getSavingStatus);
  const loadingStatus = useSelector(getLoadingStatus);
  const sequenceStatus = useSelector(getSequenceStatus);
  const { draftPreviewLink, publishedPreviewLink } = useSelector(getCourseSectionVertical);
  const courseVerticalChildren = useSelector(getCourseVerticalChildren);
  const clipboardData = useSelector(getClipboardData);
  const enableCopyPasteUnits = useSelector(getCourseUnitEnableCopyPaste);
  const staticFileNotices = useSelector(getStaticFileNotices);
  const navigate = useNavigate();
  const isEditTitleFormOpen = useSelector(state => state.courseUnit.isEditTitleFormOpen);
  const isQueryPending = useSelector(state => state.courseUnit.isQueryPending);
  const { hasExplicitStaffLock, published, releaseDate } = courseUnit;
  const isLastUnpublishedVersion = !hasExplicitStaffLock && published && releaseDate;
  const renderPasteComponentAlerts = usePastNotificationAlerts(staticFileNotices, courseId);

  const unitTitle = courseUnit.metadata?.displayName || '';
  const sequenceId = courseUnit.ancestorInfo?.ancestors[0].id;

  const headerNavigationsActions = {
    handleViewLive: () => {
      window.open(publishedPreviewLink, '_blank');
    },
    handlePreview: () => {
      window.open(draftPreviewLink, '_blank');
    },
  };

  const handleInternetConnectionFailed = () => {
    setInternetConnectionError(true);
  };

  const handleTitleEdit = () => {
    dispatch(changeEditTitleFormOpen(!isEditTitleFormOpen));
  };

  const handleTitleEditSubmit = (displayName) => {
    if (unitTitle !== displayName) {
      dispatch(editCourseItemQuery(blockId, displayName, sequenceId));
    }

    handleTitleEdit();
  };

  const handleNavigate = (id) => {
    if (sequenceId) {
      navigate(`/course/${courseId}/container/${blockId}/${id}`, { replace: true });
    }
  };

  const handleCreateNewCourseXBlock = (body, callback) => (
    dispatch(createNewCourseXBlock(body, callback, blockId))
  );

  const unitXBlockActions = {
    handleDelete: (XBlockId) => {
      dispatch(deleteUnitItemQuery(blockId, XBlockId));
    },
    handleDuplicate: (XBlockId) => {
      dispatch(duplicateUnitItemQuery(blockId, XBlockId));
    },
  };

  useEffect(() => {
    if (savingStatus === RequestStatus.SUCCESSFUL) {
      dispatch(updateQueryPendingStatus(true));
    } else if (savingStatus === RequestStatus.FAILED && !hasInternetConnectionError) {
      toggleErrorAlert(true);
    }
  }, [savingStatus]);

  useEffect(() => {
    dispatch(fetchCourseUnitQuery(blockId));
    dispatch(fetchCourseSectionVerticalData(blockId, sequenceId));
    dispatch(fetchCourseVerticalChildrenData(blockId));

    handleNavigate(sequenceId);
  }, [courseId, blockId, sequenceId]);

  return {
    sequenceId,
    courseUnit,
    unitTitle,
    sequenceStatus,
    savingStatus,
    isQueryPending,
    isErrorAlert,
    renderPasteComponentAlerts,
    isLastUnpublishedVersion,
    isLoading: loadingStatus.fetchUnitLoadingStatus === RequestStatus.IN_PROGRESS
      || loadingStatus.courseSectionVerticalLoadingStatus === RequestStatus.IN_PROGRESS,
    isEditTitleFormOpen,
    isInternetConnectionAlertFailed: savingStatus === RequestStatus.FAILED,
    enableCopyPasteUnits,
    handleInternetConnectionFailed,
    unitXBlockActions,
    headerNavigationsActions,
    handleTitleEdit,
    clipboardData,
    handleTitleEditSubmit,
    handleCreateNewCourseXBlock,
    courseVerticalChildren,
  };
};

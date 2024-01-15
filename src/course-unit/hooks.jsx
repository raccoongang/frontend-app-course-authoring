import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppContext } from '@edx/frontend-platform/react';
import { useNavigate } from 'react-router-dom';

import { RequestStatus } from '../data/constants';
import {
  createNewCourseXblock,
  fetchCourseUnitQuery,
  editCourseItemQuery,
  fetchCourse,
  fetchCourseSectionVerticalData,
} from './data/thunk';
import {
  getCourseUnitData,
  getLoadingStatus,
  getSavingStatus,
} from './data/selectors';
import { changeEditTitleFormOpen, updateQueryPendingStatus } from './data/slice';
import { getUnitViewLivePath, getUnitPreviewPath } from './utils';

// eslint-disable-next-line import/prefer-default-export
export const useCourseUnit = ({ courseId, blockId }) => {
  const dispatch = useDispatch();

  const [isErrorAlert, toggleErrorAlert] = useState(false);
  const [hasInternetConnectionError, setInternetConnectionError] = useState(false);
  const { config } = useContext(AppContext);
  const courseUnit = useSelector(getCourseUnitData);
  const savingStatus = useSelector(getSavingStatus);
  const loadingStatus = useSelector(getLoadingStatus);
  const navigate = useNavigate();
  const isEditTitleFormOpen = useSelector(state => state.courseUnit.isEditTitleFormOpen);
  const isQueryPending = useSelector(state => state.courseUnit.isQueryPending);

  const unitTitle = courseUnit.metadata?.displayName || '';
  const sequenceId = courseUnit.ancestorInfo?.ancestors[0].id;

  const headerNavigationsActions = {
    handleViewLive: () => {
      window.open(config.LMS_BASE_URL + getUnitViewLivePath(courseId, blockId), '_blank');
    },
    handlePreview: () => {
      const subsectionId = courseUnit.ancestorInfo?.ancestors[0]?.id.split('@').pop();
      const sectionId = courseUnit.ancestorInfo?.ancestors[1]?.id.split('@').pop();
      window.open(config.PREVIEW_BASE_URL + getUnitPreviewPath(courseId, sectionId, subsectionId, blockId), '_blank');
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

  const handleCreateNewCourseXblock = (body, callback) => (
    dispatch(createNewCourseXblock(body, callback))
  );

  useEffect(() => {
    if (savingStatus === RequestStatus.SUCCESSFUL) {
      dispatch(updateQueryPendingStatus(false));
    } else if (savingStatus === RequestStatus.FAILED && !hasInternetConnectionError) {
      toggleErrorAlert(true);
    }
  }, [savingStatus]);

  useEffect(() => {
    dispatch(fetchCourseUnitQuery(blockId));
    dispatch(fetchCourseSectionVerticalData(blockId, sequenceId));
    dispatch(fetchCourse(courseId));

    handleNavigate(sequenceId);
  }, [courseId, blockId, sequenceId]);

  return {
    sequenceId,
    courseUnit,
    unitTitle,
    savingStatus,
    isQueryPending,
    isErrorAlert,
    isLoading: loadingStatus.fetchUnitLoadingStatus === RequestStatus.IN_PROGRESS
      || loadingStatus.courseSectionVerticalLoadingStatus === RequestStatus.IN_PROGRESS,
    isEditTitleFormOpen,
    isInternetConnectionAlertFailed: savingStatus === RequestStatus.FAILED,
    handleInternetConnectionFailed,
    headerNavigationsActions,
    handleTitleEdit,
    handleTitleEditSubmit,
    handleCreateNewCourseXblock,
  };
};

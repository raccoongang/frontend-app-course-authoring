import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { RequestStatus } from '../data/constants';
import {
  createNewCourseXBlock,
  fetchCourseUnitQuery,
  editCourseItemQuery,
  fetchCourseSectionVerticalData,
  fetchCourseVerticalChildrenData,
  deleteUnitItemQuery,
  duplicateUnitItemQuery,
  setXBlockOrderListQuery,
  editCourseUnitVisibilityAndData,
  fetchCsrfTokenQuery,
} from './data/thunk';
import {
  getCourseSectionVertical,
  getCourseVerticalChildren,
  getCourseUnitData,
  getIsLoading,
  getSavingStatus,
  getErrorMessage,
  getSequenceStatus,
  getStaticFileNotices,
  getIsLoadingFailed,
} from './data/selectors';
import { changeEditTitleFormOpen, updateQueryPendingStatus } from './data/slice';
import { PUBLISH_TYPES } from './constants';

import { useCopyToClipboard } from '../generic/clipboard';

// eslint-disable-next-line import/prefer-default-export
export const useCourseUnit = ({ courseId, blockId }) => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const courseUnit = useSelector(getCourseUnitData);
  const savingStatus = useSelector(getSavingStatus);
  const isLoading = useSelector(getIsLoading);
  const isLoadingFailed = useSelector(getIsLoadingFailed);
  const errorMessage = useSelector(getErrorMessage);
  const sequenceStatus = useSelector(getSequenceStatus);
  const { draftPreviewLink, publishedPreviewLink } = useSelector(getCourseSectionVertical);
  const courseVerticalChildren = useSelector(getCourseVerticalChildren);
  const staticFileNotices = useSelector(getStaticFileNotices);
  const navigate = useNavigate();
  const isTitleEditFormOpen = useSelector(state => state.courseUnit.isTitleEditFormOpen);
  const { currentlyVisibleToStudents } = courseUnit;
  const { sharedClipboardData, showPasteXBlock, showPasteUnit } = useCopyToClipboard();
  const { canPasteComponent } = courseVerticalChildren;

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

  const handleTitleEdit = () => {
    dispatch(changeEditTitleFormOpen(!isTitleEditFormOpen));
  };

  const handleConfigureSubmit = useCallback((id, isVisible, groupAccess, closeModalFn) => {
    dispatch(editCourseUnitVisibilityAndData(id, PUBLISH_TYPES.republish, isVisible, groupAccess, true, blockId));
    closeModalFn();
  }, [courseId, blockId]);

  const handleTitleEditSubmit = (displayName) => {
    if (unitTitle !== displayName) {
      dispatch(editCourseItemQuery(blockId, displayName, sequenceId));
    }

    handleTitleEdit();
  };

  const handleNavigate = (id) => {
    if (sequenceId) {
      const path = `/course/${courseId}/container/${blockId}/${id}`;
      const options = { replace: true };
      if (searchParams.size) {
        navigate({
          pathname: path,
          search: `?${searchParams}`,
        }, options);
      } else {
        navigate(path, options);
      }
    }
  };

  const handleCreateNewCourseXBlock = (body, callback) => (
    dispatch(createNewCourseXBlock(body, callback, blockId))
  );

  const unitXBlockActions = useMemo(() => ({
    handleDelete: (XBlockId) => {
      dispatch(deleteUnitItemQuery(blockId, XBlockId));
    },
    handleDuplicate: (XBlockId) => {
      dispatch(duplicateUnitItemQuery(blockId, XBlockId));
    },
  }), [courseId, blockId]);

  const handleXBlockDragAndDrop = (xblockListIds, restoreCallback) => {
    dispatch(setXBlockOrderListQuery(blockId, xblockListIds, restoreCallback));
  };

  useEffect(() => {
    if (savingStatus === RequestStatus.SUCCESSFUL) {
      dispatch(updateQueryPendingStatus(true));
    }
  }, [savingStatus]);

  useEffect(() => {
    dispatch(fetchCourseUnitQuery(blockId));
    dispatch(fetchCourseSectionVerticalData(blockId, sequenceId));
    dispatch(fetchCourseVerticalChildrenData(blockId));
    dispatch(fetchCsrfTokenQuery());
    handleNavigate(sequenceId);
  }, [courseId, blockId, sequenceId]);

  return {
    sequenceId,
    courseUnit,
    unitTitle,
    errorMessage,
    sequenceStatus,
    savingStatus,
    staticFileNotices,
    currentlyVisibleToStudents,
    isLoading,
    isLoadingFailed,
    isTitleEditFormOpen,
    sharedClipboardData,
    showPasteXBlock,
    showPasteUnit,
    unitXBlockActions,
    headerNavigationsActions,
    handleTitleEdit,
    handleTitleEditSubmit,
    handleCreateNewCourseXBlock,
    handleConfigureSubmit,
    courseVerticalChildren,
    handleXBlockDragAndDrop,
    canPasteComponent,
  };
};

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToggle } from '@edx/paragon';

import { fetchCourseOutlineIndexQuery } from './data/thunk';
import {
  getLoadingOutlineIndexStatus,
  getOutlineIndexData,
  getSectionsList,
} from './data/selectors';
import { RequestStatus } from '../data/constants';
import { setCurrentHighlights } from './data/slice';

const useCourseOutline = ({ courseId }) => {
  const dispatch = useDispatch();

  const { reindexLink } = useSelector(getOutlineIndexData);
  const { outlineIndexLoadingStatus } = useSelector(getLoadingOutlineIndexStatus);
  const sectionsList = useSelector(getSectionsList);

  const [isSectionsExpanded, setSectionsExpanded] = useState(false);
  const [isHighlightsModalOpen, openHighlightsModal, closeHighlightsModal] = useToggle(false);

  const headerNavigationsActions = {
    handleNewSection: () => {
      // TODO add handler
    },
    handleReIndex: () => {
      // TODO add handler
    },
    handleExpandAll: () => {
      setSectionsExpanded((prevState) => !prevState);
    },
    handleViewLive: () => {
      // TODO add handler
    },
  };

  useEffect(() => {
    dispatch(fetchCourseOutlineIndexQuery(courseId));
  }, [courseId]);

  const handleOpenHighlightsModal = (highlights) => {
    dispatch(setCurrentHighlights(highlights));
    openHighlightsModal();
  };

  return {
    isLoading: outlineIndexLoadingStatus === RequestStatus.IN_PROGRESS,
    isReIndexShow: Boolean(reindexLink),
    isSectionsExpanded,
    headerNavigationsActions,
    sectionsList,
    handleOpenHighlightsModal,
    isHighlightsModalOpen,
    closeHighlightsModal,
  };
};

// eslint-disable-next-line import/prefer-default-export
export { useCourseOutline };

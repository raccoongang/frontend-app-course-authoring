import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RequestStatus } from '../data/constants';
import {
  getLoadingOutlineIndexStatus,
  getOutlineIndexData,
  getStatusBarData,
} from './data/selectors';
import {
  fetchCourseBestPracticesQuery,
  fetchCourseLaunchQuery,
  fetchCourseOutlineIndexQuery,
} from './data/thunk';

const useCourseOutline = ({ courseId }) => {
  const dispatch = useDispatch();
  const { reindexLink } = useSelector(getOutlineIndexData);
  const { outlineIndexLoadingStatus } = useSelector(getLoadingOutlineIndexStatus);
  const statusBarData = useSelector(getStatusBarData);

  const [isSectionsExpanded, setSectionsExpanded] = useState(false);

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

  const handleEnableHighlights = () => {
    console.log('handleEnableHighlights');
  };

  useEffect(() => {
    dispatch(fetchCourseOutlineIndexQuery(courseId));
    dispatch(fetchCourseBestPracticesQuery({ courseId }));
    dispatch(fetchCourseLaunchQuery({ courseId }));
  }, [courseId]);

  return {
    isLoading: outlineIndexLoadingStatus === RequestStatus.IN_PROGRESS,
    isReIndexShow: Boolean(reindexLink),
    isSectionsExpanded,
    headerNavigationsActions,
    handleEnableHighlights,
    statusBarData,
  };
};

// eslint-disable-next-line import/prefer-default-export
export { useCourseOutline };

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RequestStatus } from '../data/constants';
import {
  fetchCourseBestPracticesQuery,
  fetchCourseLaunchQuery,
  fetchCourseOutlineIndexQuery,
} from './data/thunk';
import { getCourseOutline } from './data/selectors';

const useCourseOutline = ({ courseId }) => {
  const dispatch = useDispatch();
  const {
    reIndexLink,
    outlineIndexLoadingStatus,
    courseReleaseDate,
    highlightsEnabledForMessaging,
    highlightsDocUrl,
    checklist,
    isSelfPaced,
  } = useSelector(getCourseOutline);

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
    isReIndexShow: Boolean(reIndexLink),
    isSectionsExpanded,
    headerNavigationsActions,
    handleEnableHighlights,
    statusBarData: {
      courseReleaseDate,
      highlightsEnabledForMessaging,
      highlightsDocUrl,
      checklist,
      isSelfPaced,
    },
  };
};

// eslint-disable-next-line import/prefer-default-export
export { useCourseOutline };

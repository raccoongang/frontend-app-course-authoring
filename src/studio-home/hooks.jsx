import { useEffect, useState } from 'react';
import { history } from '@edx/frontend-platform';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RequestStatus } from '../data/constants';
import { COURSE_CREATOR_STATUSES } from '../constants';
import { updateSavingStatus } from '../generic/data/slice';
import { getCourseData, getRedirectUrlObj, getSavingStatus } from '../generic/data/selectors';
import { redirectToCourseIndex } from './constants';
import { fetchStudioHomeData } from './data/thunks';
import {
  getLoadingStatus,
  getStudioHomeData,
} from './data/selectors';

const useStudioHome = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const studioHomeItems = useSelector(getStudioHomeData);
  const loadingStatus = useSelector(getLoadingStatus);
  const savingStatus = useSelector(getSavingStatus);
  const newCourseData = useSelector(getCourseData);
  const redirectUrlObj = useSelector(getRedirectUrlObj);
  const [showNewCourseContainer, setShowNewCourseContainer] = useState(false);
  const isLoading = loadingStatus === RequestStatus.IN_PROGRESS;

  useEffect(() => {
    dispatch(fetchStudioHomeData(location.search ?? ''));
    setShowNewCourseContainer(false);
  }, [location.search]);

  useEffect(() => {
    if (savingStatus === RequestStatus.SUCCESSFUL) {
      dispatch(updateSavingStatus({ status: '' }));
      const { url } = redirectUrlObj;
      if (url) {
        history.push(redirectToCourseIndex(url));
      }
    }
  }, [savingStatus]);

  const {
    optimizationEnabled,
    courseCreatorStatus,
  } = studioHomeItems;

  const showOrganizationDropdown = optimizationEnabled && courseCreatorStatus === COURSE_CREATOR_STATUSES.granted;

  return {
    isLoading,
    savingStatus,
    newCourseData,
    studioHomeItems,
    showNewCourseContainer,
    showOrganizationDropdown,
    dispatch,
    setShowNewCourseContainer,
  };
};

// eslint-disable-next-line import/prefer-default-export
export { useStudioHome };

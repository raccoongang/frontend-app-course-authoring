import { useEffect, useState } from 'react';
import { history } from '@edx/frontend-platform';
import { useDispatch, useSelector } from 'react-redux';

import { RequestStatus } from '../data/constants';
import {
  updateSavingStatus,
} from '../generic/data/slice';
import { getCourseData, getRedirectUrlObj, getSavingStatus } from '../generic/data/selectors';
import {
  getLoadingStatus,
  getStudioHomeData,
} from './data/selectors';
import { fetchStudioHomeData } from './data/thunks';
import { redirectToCourseIndex } from './constants';

const useStudioHome = () => {
  const dispatch = useDispatch();
  const studioHomeData = useSelector(getStudioHomeData);
  const loadingStatus = useSelector(getLoadingStatus);
  const savingStatus = useSelector(getSavingStatus);
  const newCourseData = useSelector(getCourseData);
  const redirectUrlObj = useSelector(getRedirectUrlObj);
  const [studioHomeItems, setStudioHomeItems] = useState(studioHomeData);
  const [showNewCourseContainer, setShowNewCourseContainer] = useState(false);
  const isLoading = loadingStatus === RequestStatus.IN_PROGRESS;

  useEffect(() => {
    dispatch(fetchStudioHomeData());
  }, []);

  useEffect(() => {
    if (studioHomeData) {
      setStudioHomeItems(studioHomeData);
    }
  }, [studioHomeData]);

  useEffect(() => {
    if (savingStatus === RequestStatus.SUCCESSFUL) {
      dispatch(updateSavingStatus({ status: '' }));
      const { url } = redirectUrlObj;
      if (url) {
        history.push(redirectToCourseIndex(url));
      }
    }
  }, [savingStatus]);
  return {
    isLoading,
    savingStatus,
    newCourseData,
    studioHomeItems,
    showNewCourseContainer,
    dispatch,
    setShowNewCourseContainer,
  };
};

// eslint-disable-next-line import/prefer-default-export
export { useStudioHome };

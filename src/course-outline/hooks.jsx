import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchCourseOutlineIndexQuery, fetchCourseReindexQuery } from './data/thunk';
import { getLoadingOutlineIndexStatus, getOutlineIndexData } from './data/selectors';
import { RequestStatus } from '../data/constants';

const useCourseOutline = ({ courseId }) => {
  const dispatch = useDispatch();
  const { reindexLink } = useSelector(getOutlineIndexData);
  const { outlineIndexLoadingStatus } = useSelector(getLoadingOutlineIndexStatus);

  const [isSectionsExpanded, setSectionsExpanded] = useState(false);
  const [isReindexButtonDisable, setIsReindexButtonDisable] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const headerNavigationsActions = {
    handleNewSection: () => {
      // TODO add handler
    },
    handleReIndex: () => {
      setIsReindexButtonDisable(true);
      setShowSuccessAlert(false);
      setShowErrorAlert(false);

      dispatch(fetchCourseReindexQuery(courseId, reindexLink)).then((result) => {
        if (result) {
          setShowSuccessAlert(true);
        } else {
          setShowErrorAlert(true);
        }

        setIsReindexButtonDisable(false);
      });
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

  return {
    isLoading: outlineIndexLoadingStatus === RequestStatus.IN_PROGRESS,
    isReIndexShow: Boolean(reindexLink),
    showSuccessAlert,
    showErrorAlert,
    isReindexButtonDisable,
    isSectionsExpanded,
    headerNavigationsActions,
  };
};

// eslint-disable-next-line import/prefer-default-export
export { useCourseOutline };

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToggle } from '@edx/paragon';

import { useHelpUrls } from '../help-urls/hooks';
import { RequestStatus } from '../data/constants';
import {
  setCurrentSection,
  updateSavingStatus,
} from './data/slice';
import {
  getLoadingStatus,
  getOutlineIndexData,
  getSavingStatus,
  getStatusBarData,
  getSectionsList, getCurrentSection,
} from './data/selectors';
import {
  enableCourseHighlightsEmailsQuery,
  fetchCourseBestPracticesQuery,
  fetchCourseLaunchQuery,
  fetchCourseOutlineIndexQuery,
  fetchCourseReindexQuery, publishCourseSectionQuery,
  updateCourseSectionHighlightsQuery,
} from './data/thunk';

const useCourseOutline = ({ courseId }) => {
  const dispatch = useDispatch();

  const { reindexLink, courseStructure } = useSelector(getOutlineIndexData);
  const { outlineIndexLoadingStatus, reIndexLoadingStatus } = useSelector(getLoadingStatus);
  const statusBarData = useSelector(getStatusBarData);
  const savingStatus = useSelector(getSavingStatus);
  const sectionsList = useSelector(getSectionsList);
  const currentSection = useSelector(getCurrentSection);

  const [isEnableHighlightsModalOpen, openEnableHighlightsModal, closeEnableHighlightsModal] = useToggle(false);
  const [isSectionsExpanded, setSectionsExpanded] = useState(false);
  const [isDisabledReindexButton, setDisableReindexButton] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [isHighlightsModalOpen, openHighlightsModal, closeHighlightsModal] = useToggle(false);
  const [isPublishModalOpen, openPublishModal, closePublishModal] = useToggle(false);

  const headerNavigationsActions = {
    handleNewSection: () => {
      // TODO add handler
    },
    handleReIndex: () => {
      setDisableReindexButton(true);
      setShowSuccessAlert(false);
      setShowErrorAlert(false);

      dispatch(fetchCourseReindexQuery(courseId, reindexLink)).then(() => {
        setDisableReindexButton(false);
      });
    },
    handleExpandAll: () => {
      setSectionsExpanded((prevState) => !prevState);
    },
    handleViewLive: () => {
      // TODO add handler
    },
  };

  const handleEnableHighlightsSubmit = () => {
    dispatch(updateSavingStatus({ status: RequestStatus.PENDING }));
    dispatch(enableCourseHighlightsEmailsQuery(courseId));
    closeEnableHighlightsModal();
  };

  const handleInternetConnectionFailed = () => {
    dispatch(updateSavingStatus({ status: RequestStatus.FAILED }));
  };

  const handleOpenHighlightsModal = (section) => {
    dispatch(setCurrentSection(section));
    openHighlightsModal();
  };

  const handleHighlightsFormSubmit = (highlights) => {
    const dataToSend = Object.values(highlights).filter(Boolean);
    dispatch(updateCourseSectionHighlightsQuery(currentSection.id, dataToSend));

    closeHighlightsModal();
  };

  const handleSubmitPublishSection = () => {
    dispatch(publishCourseSectionQuery(currentSection.id));

    closePublishModal();
  };

  useEffect(() => {
    dispatch(fetchCourseOutlineIndexQuery(courseId));
    dispatch(fetchCourseBestPracticesQuery({ courseId }));
    dispatch(fetchCourseLaunchQuery({ courseId }));
  }, [courseId]);

  useEffect(() => {
    if (reIndexLoadingStatus === RequestStatus.FAILED) {
      setShowErrorAlert(true);
    }

    if (reIndexLoadingStatus === RequestStatus.SUCCESSFUL) {
      setShowSuccessAlert(true);
    }
  }, [reIndexLoadingStatus]);

  const {
    visibility: learnMoreVisibilityUrl,
    grading: learnMoreGradingUrl,
    outline: learnMoreOutlineUrl,
  } = useHelpUrls(['visibility', 'grading', 'outline']);

  return {
    savingStatus,
    sectionsList,
    isLoading: outlineIndexLoadingStatus === RequestStatus.IN_PROGRESS,
    isReIndexShow: Boolean(reindexLink),
    showSuccessAlert,
    showErrorAlert,
    learnMoreVisibilityUrl,
    learnMoreGradingUrl,
    learnMoreOutlineUrl,
    isDisabledReindexButton,
    isSectionsExpanded,
    isPublishModalOpen,
    openPublishModal,
    closePublishModal,
    headerNavigationsActions,
    handleEnableHighlightsSubmit,
    handleHighlightsFormSubmit,
    handleSubmitPublishSection,
    statusBarData,
    isEnableHighlightsModalOpen,
    openEnableHighlightsModal,
    closeEnableHighlightsModal,
    isInternetConnectionAlertFailed: savingStatus === RequestStatus.FAILED,
    handleInternetConnectionFailed,
    handleOpenHighlightsModal,
    isHighlightsModalOpen,
    closeHighlightsModal,
    courseName: courseStructure?.displayName,
  };
};

// eslint-disable-next-line import/prefer-default-export
export { useCourseOutline };

import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppContext } from '@edx/frontend-platform/react';

import {
  fetchCourseUnitQuery,
  editCourseItemQuery,
} from './data/thunk';
import {
  getCourseUnit,
  getLoadingStatus,
  getSavingStatus,
} from './data/selectors';
import { updateSavingStatus } from './data/slice';
import { RequestStatus } from '../data/constants';
import { useCourseOutline } from "../course-outline/hooks";


const useCourseUnit = ({ courseId, blockId }) => {
  const dispatch = useDispatch();

  const { config } = useContext(AppContext);
  const courseUnit = useSelector(getCourseUnit);
  const savingStatus = useSelector(getSavingStatus);
  const loadingStatus = useSelector(getLoadingStatus);
  // const { sectionsList } = useCourseOutline({ intl, courseId });

  const [isTitleFormOpen, toggleTitleFormOpen] = useState(false);

  const unitTitle = courseUnit.metadata?.displayName || '';

  const breadcrumbsData = {
    section: {
      id: courseUnit?.ancestorInfo[1]?.id,
      // displayName: courseUnit.ancestorInfo[1]?.displayName,
      // dropdown: sectionsList
    },
    subsection: {
      id: courseUnit?.ancestorInfo[0]?.id,
      // displayName: courseUnit.ancestorInfo[0]?.displayName,
    },
  };

  const headerNavigationsActions = {
    handleViewLive: () => {
      window.open(`${config.LMS_BASE_URL}/courses/${courseId}/jump_to/${blockId}`, '_blank');
    },
    handlePreview: () => {
      // http://preview.localhost:18000/courses/course-v1:edX+DemoX+Demo_Course/courseware/interactive_demonstrations/19a30717eff543078a5d94ae9d6c18a5/1?activate_block_id=block-v1%3AedX%2BDemoX%2BDemo_Course%2Btype%40vertical%2Bblock%40867dddb6f55d410caaa9c1eb9c6743ec
      // ${config.PREVIEW_BASE_URL}/courses/${courseId}/courseware/interactive_demonstrations/19a30717eff543078a5d94ae9d6c18a5/1?activate_block_id=${blockId}
      window.open('https://google.com', '_blank');
    },
  };

  const handleInternetConnectionFailed = () => {
    dispatch(updateSavingStatus({ status: RequestStatus.FAILED }));
  };

  const handleTitleEdit = () => {
    toggleTitleFormOpen(!isTitleFormOpen);
  };

  const handleTitleEditSubmit = (displayName) => {
    if (unitTitle !== displayName) {
      dispatch(editCourseItemQuery(blockId, displayName));
    }

    handleTitleEdit();
  };

  useEffect(() => {
    dispatch(fetchCourseUnitQuery(blockId));
  }, [courseId]);

  return {
    courseUnit,
    unitTitle,
    isLoading: loadingStatus.fetchUnitLoadingStatus === RequestStatus.IN_PROGRESS,
    isTitleFormOpen,
    isInternetConnectionAlertFailed: savingStatus === RequestStatus.FAILED,
    handleInternetConnectionFailed,
    headerNavigationsActions,
    handleTitleEdit,
    handleTitleEditSubmit,
    breadcrumbsData,
  };
};

// eslint-disable-next-line import/prefer-default-export
export { useCourseUnit };

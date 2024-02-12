import { useDispatch, useSelector } from 'react-redux';
import { useContext, useEffect } from 'react';
import { AppContext } from '@edx/frontend-platform/react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useToggle } from '@edx/paragon';

import { RequestStatus } from '../data/constants';
import {
  getTextbooksData,
  getLoadingStatus,
  getSavingStatus,
} from './data/selectors';
import {
  createTextbookQuery,
  fetchTextbooksQuery,
} from './data/thunk';
import messages from './messages';
import { updateSavingStatus } from '../certificates/data/slice';

const useTextbooks = (courseId) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const { config } = useContext(AppContext);

  const textbooks = useSelector(getTextbooksData);
  const loadingStatus = useSelector(getLoadingStatus);
  const savingStatus = useSelector(getSavingStatus);

  const [isTextbookFormOpen, openTextbookForm, closeTextbookForm] = useToggle(false);

  const breadcrumbs = [
    {
      label: intl.formatMessage(messages.breadcrumbContent),
      href: `${config.STUDIO_BASE_URL}/course/${courseId}`,
    },
    {
      label: intl.formatMessage(messages.breadcrumbPagesAndResources),
      href: `/course/${courseId}/pages-and-resources`,
    },
    {
      label: '',
      href: `/course/${courseId}/pages-and-resources/textbooks`,
    },
  ];

  const handleTextbookFormSubmit = (formValues) => {
    dispatch(createTextbookQuery(courseId, formValues));
  };

  const handleSavingStatusDispatch = (status) => {
    dispatch(updateSavingStatus(status));
  };

  useEffect(() => {
    dispatch(fetchTextbooksQuery(courseId));
  }, [courseId]);

  useEffect(() => {
    if (savingStatus === RequestStatus.SUCCESSFUL) {
      closeTextbookForm();
    }
  }, [savingStatus]);

  return {
    isLoading: loadingStatus === RequestStatus.IN_PROGRESS,
    isInternetConnectionAlertFailed: savingStatus === RequestStatus.FAILED,
    isQueryPending: savingStatus === RequestStatus.PENDING,
    textbooks,
    breadcrumbs,
    isTextbookFormOpen,
    openTextbookForm,
    closeTextbookForm,
    handleTextbookFormSubmit,
    handleSavingStatusDispatch,
  };
};

// eslint-disable-next-line import/prefer-default-export
export { useTextbooks };

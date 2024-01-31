import { useDispatch, useSelector } from 'react-redux';
import { useContext, useEffect } from 'react';
import { AppContext } from '@edx/frontend-platform/react';
import { useIntl } from '@edx/frontend-platform/i18n';

import { RequestStatus } from '../data/constants';
import { getTextbooksData, getLoadingStatus } from './data/selectors';
import { fetchTextbooksQuery } from './data/thunk';
import messages from './messages';

const useTextbooks = (courseId) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const { config } = useContext(AppContext);

  const textbooks = useSelector(getTextbooksData);
  const loadingStatus = useSelector(getLoadingStatus);

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

  useEffect(() => {
    dispatch(fetchTextbooksQuery(courseId));
  }, [courseId]);

  return {
    isLoading: loadingStatus === RequestStatus.IN_PROGRESS,
    textbooks,
    breadcrumbs,
  };
};

// eslint-disable-next-line import/prefer-default-export
export { useTextbooks };

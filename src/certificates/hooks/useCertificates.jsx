import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from '@edx/frontend-platform/i18n';

import { getHasCertificates, getHasCertificateModes } from '../data/selectors';
import { fetchCertificates } from '../data/thunks';
import { useModel } from '../../generic/model-store';
import getPageHeadTitle from '../../generic/utils';

import messages from '../messages';

const useCertificates = ({ courseId }) => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const hasCertificates = useSelector(getHasCertificates);
  const hasCertificateModes = useSelector(getHasCertificateModes);

  useEffect(() => {
    dispatch(fetchCertificates(courseId));
  }, [courseId]);

  const courseDetails = useModel('courseDetails', courseId);
  document.title = getPageHeadTitle(courseDetails?.name, intl.formatMessage(messages.headingTitleTabText));

  return { hasCertificates, hasCertificateModes };
};

export default useCertificates;

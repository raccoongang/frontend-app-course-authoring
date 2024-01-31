import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from '@edx/frontend-platform/i18n';

import { RequestStatus } from '../../data/constants';
import getPageHeadTitle from '../../generic/utils';
import {
  getMode, getLoadingStatus, getCertificates, getHasCertificateModes, getCourseTitle,
} from '../data/selectors';
import { setMode } from '../data/slice';
import { fetchCertificates } from '../data/thunks';
import { MODE_STATES } from '../data/constants';

import messages from '../messages';

const useCertificates = ({ courseId }) => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const mode = useSelector(getMode);
  const certificates = useSelector(getCertificates);
  const loadingStatus = useSelector(getLoadingStatus);
  const hasCertificateModes = useSelector(getHasCertificateModes);
  const title = useSelector(getCourseTitle);

  const isLoading = useMemo(() => loadingStatus === RequestStatus.IN_PROGRESS, [loadingStatus]);

  useEffect(() => {
    if (!hasCertificateModes) {
      dispatch(setMode(MODE_STATES.NO_MODES));
    } else if (hasCertificateModes && !certificates.length) {
      dispatch(setMode(MODE_STATES.NO_CERTIFICATES));
    } else if (hasCertificateModes && certificates.length) {
      dispatch(setMode(MODE_STATES.VIEW));
    }
  }, [hasCertificateModes, certificates]);

  useEffect(() => {
    dispatch(fetchCertificates(courseId));
  }, [courseId]);

  document.title = getPageHeadTitle(title, intl.formatMessage(messages.headingTitleTabText));

  return {
    mode, isLoading, loadingStatus,
  };
};

export default useCertificates;

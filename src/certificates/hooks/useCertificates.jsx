import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getHasCertificates, getHasCertificateModes } from '../data/selectors';
import { fetchCertificates } from '../data/thunks';

const useCertificates = ({ courseId }) => {
  const dispatch = useDispatch();

  const hasCertificates = useSelector(getHasCertificates);
  const hasCertificateModes = useSelector(getHasCertificateModes);

  useEffect(() => {
    dispatch(fetchCertificates(courseId));
  }, [courseId]);

  return { hasCertificates, hasCertificateModes };
};

export default useCertificates;

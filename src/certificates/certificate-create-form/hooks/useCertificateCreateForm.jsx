import { useSelector, useDispatch } from 'react-redux';
import { useIntl } from '@edx/frontend-platform/i18n';

import { MODE_STATES } from '../../data/constants';
import { getCourseTitle } from '../../data/selectors';
import { setMode } from '../../data/slice';
import { createCourseCertificate } from '../../data/thunks';

const useCertificateCreateForm = (courseId) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const courseTitle = useSelector(getCourseTitle);

  const handleCertificateSubmit = (values) => {
    dispatch(createCourseCertificate(courseId, values));
  };

  const cardCreateCancel = (resetForm) => {
    dispatch(setMode(MODE_STATES.noCertificates));
    resetForm();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return {
    intl, courseTitle, handleCertificateSubmit, cardCreateCancel,
  };
};

export default useCertificateCreateForm;

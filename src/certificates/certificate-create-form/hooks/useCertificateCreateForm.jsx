import { useSelector, useDispatch } from 'react-redux';

import { MODE_STATES } from '../../data/constants';
import { getCourseTitle } from '../../data/selectors';
import { setMode } from '../../data/slice';
import { createCourseCertificate } from '../../data/thunks';

const useCertificateCreateForm = (courseId) => {
  const dispatch = useDispatch();
  const courseTitle = useSelector(getCourseTitle);

  const handleCertificateSubmit = (values) => {
    dispatch(createCourseCertificate(courseId, values));
  };

  const handleFormCancel = (resetForm) => {
    dispatch(setMode(MODE_STATES.noCertificates));
    resetForm();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return {
    courseTitle, handleCertificateSubmit, handleFormCancel,
  };
};

export default useCertificateCreateForm;

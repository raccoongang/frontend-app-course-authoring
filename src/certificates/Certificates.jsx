import PropTypes from 'prop-types';

import MainLayout from './layout';
import WithoutModes from './without-modes';
import WithModesWithoutCertificates from './with-modes-without-certificates';
import useCertificates from './hooks/useCertificates';

const Certificates = ({ courseId }) => {
  const { hasCertificates, hasCertificateModes } = useCertificates({ courseId });

  if (!hasCertificateModes) {
    return <WithoutModes courseId={courseId} />;
  }

  if (hasCertificateModes && !hasCertificates) {
    return <WithModesWithoutCertificates courseId={courseId} />;
  }

  return (
    <MainLayout courseId={courseId} /> // TODO: Show certificates component in the task (https://youtrack.raccoongang.com/issue/AXIMST-166)
  );
};

Certificates.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default Certificates;

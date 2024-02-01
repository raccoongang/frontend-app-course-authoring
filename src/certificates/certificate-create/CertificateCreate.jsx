import PropTypes from 'prop-types';

import CertificatesCard from '../certificates-card/CertificatesCard';
import { defaultCertificate } from '../constants';

const CertificateCreate = ({ courseId }) => (
  <CertificatesCard courseId={courseId} {...defaultCertificate} />
);

CertificateCreate.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default CertificateCreate;

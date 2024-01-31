import PropTypes from 'prop-types';

import CertificatesCard from '../certificates-card/CertificatesCard';

const defaultCertificate = {
  courseTitle: '',
  signatories: [{
    name: '',
    title: '',
    organization: '',
    signatureImagePath: '',
  }],
};

const CertificateCreate = ({ courseId }) => (
  <CertificatesCard courseId={courseId} {...defaultCertificate} />
);

CertificateCreate.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default CertificateCreate;

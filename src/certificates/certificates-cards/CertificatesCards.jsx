import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import CertificatesCard from '../certificates-card/CertificatesCard';
import { getCertificates } from '../data/selectors';

const CertificatesCards = ({ courseId }) => {
  const certificates = useSelector(getCertificates);
  return (
    certificates.map((props) => <CertificatesCard key={props.id} courseId={courseId} {...props} />)
  );
};

CertificatesCards.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default CertificatesCards;

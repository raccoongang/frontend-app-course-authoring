import PropTypes from 'prop-types';
import Placeholder from '@edx/frontend-lib-content-components';

import { RequestStatus } from '../data/constants';
import Loading from '../generic/Loading';
import useCertificates from './hooks/useCertificates';
import CertificateWithoutModes from './certificate-without-modes/CertificateWithoutModes';
import EmptyCertificatesWithModes from './empty-certificates-with-modes/EmptyCertificatesWithModes';
import CertificatesCards from './certificates-cards/CertificatesCards';
import CertificateCreate from './certificate-create/CertificateCreate';
import { MODE_STATES } from './data/constants';
import MainLayout from './layout/MainLayout';

const MODE_COMPONENTS = {
  [MODE_STATES.noModes]: CertificateWithoutModes,
  [MODE_STATES.noCertificates]: EmptyCertificatesWithModes,
  [MODE_STATES.create]: CertificateCreate,
  [MODE_STATES.view]: CertificatesCards,
};

const Certificates = ({ courseId }) => {
  const { componentMode, isLoading, loadingStatus } = useCertificates({ courseId });

  if (isLoading) {
    return <Loading />;
  }

  if (loadingStatus === RequestStatus.DENIED) {
    return (
      <div className="row justify-content-center m-6">
        <Placeholder />
      </div>
    );
  }

  const ModeComponent = MODE_COMPONENTS[componentMode] || MODE_COMPONENTS[MODE_STATES.noModes];

  return (
    <MainLayout courseId={courseId} showHeaderButtons={componentMode === MODE_STATES.view}>
      <ModeComponent courseId={courseId} />
    </MainLayout>
  );
};

Certificates.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default Certificates;

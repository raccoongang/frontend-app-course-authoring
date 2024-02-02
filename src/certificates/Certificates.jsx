import PropTypes from 'prop-types';
import Placeholder from '@edx/frontend-lib-content-components';

import { RequestStatus } from '../data/constants';
import useCertificates from './hooks/useCertificates';
import WithoutModes from './without-modes/WithoutModes';
import WithModesWithoutCertificates from './with-modes-without-certificates/WithModesWithoutCertificates';
import CertificatesCards from './certificates-cards/CertificatesCards';
import CertificateCreate from './certificate-create/CertificateCreate';
import { MODE_STATES } from './data/constants';
import MainLayout from './layout/MainLayout';

const MODE_COMPONENTS = {
  [MODE_STATES.noModes]: WithoutModes,
  [MODE_STATES.noCertificates]: WithModesWithoutCertificates,
  [MODE_STATES.create]: CertificateCreate,
  [MODE_STATES.view]: CertificatesCards,
};

const Certificates = ({ courseId }) => {
  const { componentMode, isLoading, loadingStatus } = useCertificates({ courseId });

  if (isLoading) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
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

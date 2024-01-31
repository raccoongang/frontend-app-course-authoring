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

const modeCertificatesMap = {
  [MODE_STATES.NO_MODES]: WithoutModes,
  [MODE_STATES.NO_CERTIFICATES]: WithModesWithoutCertificates,
  [MODE_STATES.CREATE]: CertificateCreate,
  [MODE_STATES.VIEW]: CertificatesCards,
};

const Certificates = ({ courseId }) => {
  const { mode, isLoading, loadingStatus } = useCertificates({ courseId });

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

  const ModeComponent = modeCertificatesMap[mode] || modeCertificatesMap[MODE_STATES.NO_MODES];

  return (
    <MainLayout courseId={courseId} showHeaderButtons={mode === MODE_STATES.VIEW}>
      <ModeComponent courseId={courseId} />
    </MainLayout>
  );
};

Certificates.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default Certificates;

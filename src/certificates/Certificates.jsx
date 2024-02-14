import PropTypes from 'prop-types';
import Placeholder from '@edx/frontend-lib-content-components';

import { RequestStatus } from '../data/constants';
import Loading from '../generic/Loading';
import useCertificates from './hooks/useCertificates';
import CertificateWithoutModes from './certificate-without-modes/CertificateWithoutModes';
import EmptyCertificatesWithModes from './empty-certificates-with-modes/EmptyCertificatesWithModes';
import CertificatesList from './certificates-list/CertificatesList';
import CertificateCreateForm from './certificate-create-form/CertificateCreateForm';
import CertificateEditForm from './certificate-edit-form/CertificateEditForm';
import { MODE_STATES } from './data/constants';
import MainLayout from './layout/MainLayout';

const MODE_COMPONENTS = {
  [MODE_STATES.noModes]: CertificateWithoutModes,
  [MODE_STATES.noCertificates]: EmptyCertificatesWithModes,
  [MODE_STATES.create]: CertificateCreateForm,
  [MODE_STATES.view]: CertificatesList,
  [MODE_STATES.editAll]: CertificateEditForm,
};

const Certificates = ({ courseId }) => {
  const {
    certificates, componentMode, isLoading, loadingStatus,
  } = useCertificates({ courseId });

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
    <MainLayout courseId={courseId} showHeaderButtons={certificates?.length > 0}>
      <ModeComponent courseId={courseId} />
    </MainLayout>
  );
};

Certificates.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default Certificates;

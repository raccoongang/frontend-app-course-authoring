import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { initializeMockApp } from '@edx/frontend-platform';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { executeThunk } from '../../utils';
import initializeStore from '../../store';
import { getCertificatesApiUrl, getUpdateCertificateApiUrl } from '../data/api';
import { fetchCertificates } from '../data/thunks';
import { certificatesMock, certificatesDataMock } from '../__mocks__';
import { MODE_STATES } from '../data/constants';
import CertificatesList from './CertificatesList';

let axiosMock;
let store;
const courseId = 'course-123';

const renderComponent = () => render(
  <Provider store={store}>
    <IntlProvider locale="en">
      <CertificatesList courseId="course-123" />
    </IntlProvider>
  </Provider>,
);

const initialState = {
  certificates: {
    certificatesData: {
      certificates: certificatesMock,
      hasCertificateModes: true,
      componentMode: MODE_STATES.view,
      courseTitle: 'Course Title 1',
      courseNumber: 'Demox',
      courseNumberOverride: 'Course 101',
    },
  },
};

describe('CertificatesList Component', () => {
  beforeEach(async () => {
    initializeMockApp({
      authenticatedUser: {
        userId: 3,
        username: 'abc123',
        administrator: true,
        roles: [],
      },
    });
    store = initializeStore(initialState);
    axiosMock = new MockAdapter(getAuthenticatedHttpClient());
  });

  it('renders each certificate', () => {
    const { getByText } = renderComponent();

    certificatesMock.forEach((certificate) => {
      certificate.signatories.forEach((signatory) => {
        expect(getByText(signatory.name)).toBeInTheDocument();
        expect(getByText(signatory.title)).toBeInTheDocument();
        expect(getByText(signatory.organization)).toBeInTheDocument();
      });
    });
  });

  it('update certificate', async () => {
    const { getByText, queryByText } = renderComponent();

    const updatedCertificate = {
      ...certificatesMock[0],
      courseTitle: 'New title override',
      description: 'Description of the certificate',
      editing: true,
      isActive: false,
      name: 'Name of the certificate',
      version: 1,
    };

    axiosMock
      .onPost(getUpdateCertificateApiUrl(courseId, certificatesMock.id))
      .reply(200, updatedCertificate);
    axiosMock.reset();
    axiosMock
      .onGet(getCertificatesApiUrl(courseId))
      .reply(200, {
        ...certificatesDataMock,
        certificates: [
          updatedCertificate,
        ],
      });
    await executeThunk(fetchCertificates(courseId), store.dispatch);

    expect(getByText(updatedCertificate.courseTitle)).toBeInTheDocument();
    expect(getByText(updatedCertificate.signatories[0].name)).toBeInTheDocument();
    expect(queryByText(certificatesDataMock.certificates[0].signatories[0].name)).not.toBeInTheDocument();
    expect(queryByText(certificatesMock[0].courseTitle)).not.toBeInTheDocument();
  });
});

import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { initializeMockApp } from '@edx/frontend-platform';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import initializeStore from '../../store';
import { MODE_STATES } from '../data/constants';
import CertificatesCards from './CertificatesCards';

let store;

const mockCertificates = [
  {
    id: 1,
    courseTitle: 'Course Title 1',
    signatories: [
      {
        name: 'Signatory Name 1',
        title: 'Signatory Title 1',
        organization: 'Signatory Organization 1',
        signatureImagePath: '/path/to/signature1/image.png',
      },
      {
        name: 'Signatory Name 2',
        title: 'Signatory Title 2',
        organization: 'Signatory Organization 2',
        signatureImagePath: '/path/to/signature2/image.png',
      },
    ],
  },
];

const renderComponent = () => render(
  <Provider store={store}>
    <IntlProvider locale="en">
      <CertificatesCards courseId="course-123" />
    </IntlProvider>
  </Provider>,
);

const initialState = {
  certificates: {
    certificatesData: {
      certificates: mockCertificates,
      hasCertificateModes: true,
      componentMode: MODE_STATES.view,
      courseTitle: 'Course Title 1',
      courseNumber: 'Demox',
      courseNumberOverride: 'Course 101',
    },
  },
};

describe('CertificatesCards Component', () => {
  beforeEach(() => {
    initializeMockApp({
      authenticatedUser: {
        userId: 3,
        username: 'abc123',
        administrator: true,
        roles: [],
      },
    });
    store = initializeStore(initialState);
  });

  it('renders a CertificatesCard for each certificate', () => {
    const { getByText } = renderComponent();

    mockCertificates.forEach((certificate) => {
      certificate.signatories.forEach((signatory) => {
        expect(getByText(signatory.name)).toBeInTheDocument();
        expect(getByText(signatory.title)).toBeInTheDocument();
        expect(getByText(signatory.organization)).toBeInTheDocument();
      });
    });
  });
});

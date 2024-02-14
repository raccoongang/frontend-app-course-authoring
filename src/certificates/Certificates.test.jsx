import { render } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { initializeMockApp } from '@edx/frontend-platform';
import { AppProvider } from '@edx/frontend-platform/react';
import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { executeThunk } from '../utils';
import initializeStore from '../store';
import useCertificates from './hooks/useCertificates';
import { MODE_STATES } from './data/constants';
import { getCertificatesApiUrl } from './data/api';
import { fetchCertificates } from './data/thunks';
import { certificatesDataMock } from './__mocks__';
import Certificates from './Certificates';
import messages from './messages';

let axiosMock;
let store;
const courseId = 'course-123';

jest.mock('@edx/frontend-platform/i18n', () => ({
  ...jest.requireActual('@edx/frontend-platform/i18n'),
  useIntl: () => ({
    formatMessage: (message) => message.defaultMessage,
  }),
}));

jest.mock('./hooks/useCertificates', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const renderComponent = (props) => render(
  <AppProvider store={store} messages={{}}>
    <IntlProvider locale="en">
      <Certificates courseId={courseId} {...props} />
    </IntlProvider>
  </AppProvider>,
);

const initialState = {
  certificates: {
    certificatesData: {
      certificates: [],
      hasCertificateModes: false,
    },
  },
};

describe('Certificates', () => {
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
    axiosMock
      .onGet(getCertificatesApiUrl(courseId))
      .reply(200, certificatesDataMock);
    await executeThunk(fetchCertificates(courseId), store.dispatch);
  });

  it('renders WithoutModes when there are no certificate modes', () => {
    useCertificates.mockReturnValue({ componentMode: MODE_STATES.noModes, isLoading: false, loadingStatus: 'Loaded' });
    const { getByText, queryByText } = renderComponent();

    expect(getByText(messages.withoutModesText.defaultMessage)).toBeInTheDocument();
    expect(queryByText(messages.noCertificatesText.defaultMessage)).not.toBeInTheDocument();
  });

  it('renders WithModesWithoutCertificates when there are modes but no certificates', () => {
    useCertificates.mockReturnValue({ componentMode: MODE_STATES.noCertificates, isLoading: false, loadingStatus: 'Loaded' });
    const { getByText, queryByText } = renderComponent();

    expect(getByText(messages.noCertificatesText.defaultMessage)).toBeInTheDocument();
    expect(queryByText(messages.withoutModesText.defaultMessage)).not.toBeInTheDocument();
  });

  it('renders CertificatesList when there are modes and certificates', () => {
    useCertificates.mockReturnValue({ componentMode: MODE_STATES.view, isLoading: false, loadingStatus: 'Loaded' });
    const { getByText, queryByText, getByTestId } = renderComponent();

    expect(getByTestId('certificates-list')).toBeInTheDocument();
    expect(getByText(certificatesDataMock.course_title)).toBeInTheDocument();
    expect(getByText(certificatesDataMock.certificates[0].signatories[0].name)).toBeInTheDocument();
    expect(queryByText(messages.noCertificatesText.defaultMessage)).not.toBeInTheDocument();
    expect(queryByText(messages.withoutModesText.defaultMessage)).not.toBeInTheDocument();
  });

  it('renders CertificateCreateForm when there is componentMode = MODE_STATES.create', () => {
    useCertificates.mockReturnValue({ componentMode: MODE_STATES.create, isLoading: false, loadingStatus: 'Loaded' });
    const { queryByTestId, getByTestId } = renderComponent();

    expect(getByTestId('certificates-create-form')).toBeInTheDocument();
    expect(getByTestId('certificate-details-form')).toBeInTheDocument();
    expect(getByTestId('signatory-form')).toBeInTheDocument();

    expect(queryByTestId('certificate-details')).not.toBeInTheDocument();
    expect(queryByTestId('signatory')).not.toBeInTheDocument();
  });

  it('renders CertificateEditForm when there is componentMode = MODE_STATES.editAll', () => {
    useCertificates.mockReturnValue({ componentMode: MODE_STATES.editAll, isLoading: false, loadingStatus: 'Loaded' });
    const { queryByTestId, getByTestId } = renderComponent();

    expect(getByTestId('certificates-edit-form')).toBeInTheDocument();
    expect(getByTestId('certificate-details-form')).toBeInTheDocument();
    expect(getByTestId('signatory-form')).toBeInTheDocument();

    expect(queryByTestId('certificate-details')).not.toBeInTheDocument();
    expect(queryByTestId('signatory')).not.toBeInTheDocument();
  });
});

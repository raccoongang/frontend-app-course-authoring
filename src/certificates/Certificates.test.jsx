import { render } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { initializeMockApp } from '@edx/frontend-platform';
import { AppProvider } from '@edx/frontend-platform/react';

import initializeStore from '../store';
import Certificates from './Certificates';
import useCertificates from './hooks/useCertificates';
import messages from './messages';

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
  default: jest.fn(() => ({
    hasCertificates: false,
    hasCertificateModes: false,
  })),
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

  it('renders WithoutModes when there are no certificate modes', () => {
    const { getByText, queryByText } = renderComponent();
    expect(getByText(messages.withoutModesText.defaultMessage)).toBeInTheDocument();
    expect(queryByText(messages.noCertificatesText.defaultMessage)).not.toBeInTheDocument();
  });

  it('renders WithModesWithoutCertificates when there are modes but no certificates', () => {
    useCertificates.mockReturnValue({ hasCertificates: false, hasCertificateModes: true });
    const { getByText, queryByText } = renderComponent();
    expect(getByText(messages.noCertificatesText.defaultMessage)).toBeInTheDocument();
    expect(queryByText(messages.withoutModesText.defaultMessage)).not.toBeInTheDocument();
  });
});

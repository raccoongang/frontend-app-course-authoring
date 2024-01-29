import { render, waitFor } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { initializeMockApp } from '@edx/frontend-platform';
import { AppProvider } from '@edx/frontend-platform/react';

import initializeStore from '../../store';
import messages from '../messages';
import WithModesWithoutCertificates from './WithModesWithoutCertificates';

const courseId = 'course-123';
let store;

jest.mock('@edx/frontend-platform/i18n', () => ({
  ...jest.requireActual('@edx/frontend-platform/i18n'),
  useIntl: () => ({
    formatMessage: (message) => message.defaultMessage,
  }),
}));

const renderComponent = (props) => render(
  <AppProvider store={store} messages={{}}>
    <IntlProvider locale="en">
      <WithModesWithoutCertificates courseId={courseId} {...props} />
    </IntlProvider>
  </AppProvider>,
);

describe('WithModesWithoutCertificates', () => {
  beforeEach(() => {
    initializeMockApp({
      authenticatedUser: {
        userId: 3,
        username: 'abc123',
        administrator: true,
        roles: [],
      },
    });
    store = initializeStore();
  });

  it('renders correctly', async () => {
    const { getByText, queryByText } = renderComponent();
    await waitFor(() => {
      expect(getByText(messages.noCertificatesText.defaultMessage)).toBeInTheDocument();
      expect(getByText(messages.setupCertificateBtn.defaultMessage)).toBeInTheDocument();

      expect(queryByText(messages.headingActionsPreview.defaultMessage)).not.toBeInTheDocument();
      expect(queryByText(messages.headingActionsDeactivate.defaultMessage)).not.toBeInTheDocument();
    });
  });
});

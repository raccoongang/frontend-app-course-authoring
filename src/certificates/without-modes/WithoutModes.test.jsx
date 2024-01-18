import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { initializeMockApp } from '@edx/frontend-platform';
import { AppProvider } from '@edx/frontend-platform/react';

import initializeStore from '../../store';
import WithoutModes from './WithoutModes';
import messages from '../messages';

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
      <WithoutModes courseId={courseId} {...props} />
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

  test('renders correctly', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(messages.withoutModesText.defaultMessage)).toBeInTheDocument();

      expect(screen.queryByText(messages.headingActionsPreview.defaultMessage)).not.toBeInTheDocument();
      expect(screen.queryByText(messages.headingActionsDeactivate.defaultMessage)).not.toBeInTheDocument();
    });
  });
});

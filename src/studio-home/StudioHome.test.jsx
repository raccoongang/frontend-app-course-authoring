import React from 'react';
import { initializeMockApp } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { IntlProvider, injectIntl } from '@edx/frontend-platform/i18n';
import { AppProvider } from '@edx/frontend-platform/react';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';

import initializeStore from '../store';
import { studioHomeMock } from './__mocks__';
import { getStudioHomeApiUrl } from './data/api';
import messages from './messages';
import { StudioHome } from '.';

let axiosMock;
let store;
const mockPathname = '/foo-bar';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: mockPathname,
  }),
}));

const RootWrapper = () => (
  <AppProvider store={store}>
    <IntlProvider locale="en" messages={{}}>
      <StudioHome intl={injectIntl} />
    </IntlProvider>
  </AppProvider>
);

describe('<StudioHome />', () => {
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
    axiosMock = new MockAdapter(getAuthenticatedHttpClient());
    axiosMock
      .onGet(getStudioHomeApiUrl())
      .reply(200, studioHomeMock);
  });
  it('should render page and page title correctly', async () => {
    const { getByText, getByRole } = render(<RootWrapper />);
    await waitForElementToBeRemoved(() => getByRole('status'));
    expect(getByText(messages.headingTitle.defaultMessage)).toBeInTheDocument();
  });
});

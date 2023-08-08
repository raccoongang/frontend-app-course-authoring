import React from 'react';
import { IntlProvider, injectIntl } from '@edx/frontend-platform/i18n';
import { render } from '@testing-library/react';

import { AppProvider } from '@edx/frontend-platform/react';
import { initializeMockApp } from '@edx/frontend-platform';
import messages from './messages';
import GradingSidebar from '.';
import initializeStore from '../../store';

let store;
const mockPathname = '/foo-bar';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: mockPathname,
  }),
}));

const RootWrapper = () => (
  <AppProvider store={store} messages={{}}>
    <IntlProvider locale="en" messages={{}}>
      <GradingSidebar intl={injectIntl} courseId="123" />
    </IntlProvider>
  </AppProvider>
);

describe('<GradingSidebar />', () => {
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

  it('renders sidebar text content correctly', () => {
    const { getByText } = render(<RootWrapper />);
    expect(getByText(messages.gradingSidebarTitle.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.gradingSidebarAbout1.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.gradingSidebarAbout2.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.gradingSidebarAbout3.defaultMessage)).toBeInTheDocument();
  });
});

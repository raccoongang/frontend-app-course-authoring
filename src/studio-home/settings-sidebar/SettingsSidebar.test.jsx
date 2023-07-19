import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { initializeMockApp } from '@edx/frontend-platform';
import { AppProvider } from '@edx/frontend-platform/react';

import initializeStore from '../../store';
import SettingsSidebar from './SettingsSidebar';
import messages from './messages';

let store;

const RootWrapper = () => (
  <AppProvider store={store}>
    <IntlProvider locale="en" messages={{}}>
      <SettingsSidebar intl={{ formatMessage: jest.fn() }} />
    </IntlProvider>
  </AppProvider>
);

describe('<SettingsSidebar />', () => {
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
  it('renders about and other sidebar titles correctly', () => {
    const { getByText } = render(<RootWrapper />);
    expect(getByText(messages.aboutTitle.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.aboutDescription.defaultMessage)).toBeInTheDocument();
  });
});

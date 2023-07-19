import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { AppProvider } from '@edx/frontend-platform/react';
import { initializeMockApp } from '@edx/frontend-platform';

import messages from '../messages';
import initializeStore from '../../store';
import SettingsSection from '.';

let store;

const RootWrapper = () => (
  <AppProvider store={store}>
    <IntlProvider locale="en" messages={{}}>
      <SettingsSection intl={{ formatMessage: jest.fn() }} />
    </IntlProvider>
  </AppProvider>
);

describe('<SettingsSection />', () => {
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
  it('renders text content correctly', () => {
    const { getByText } = render(<RootWrapper />);
    expect(getByText(messages.organizationTitle.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.organizationLabel.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.organizationSubmitBtnText.defaultMessage)).toBeInTheDocument();
  });
});

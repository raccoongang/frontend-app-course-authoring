import React from 'react';
import { initializeMockApp } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { IntlProvider, injectIntl } from '@edx/frontend-platform/i18n';
import { AppProvider } from '@edx/frontend-platform/react';
import { render, act, fireEvent } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';

import initializeStore from '../store';
import { advancedSettingsMock } from './__mocks__';
import { getCourseAdvancedSettingsApiUrl } from './data/api';
import AdvancedSettings from './AdvancedSettings';

let axiosMock;
let store;
const mockPathname = '/foo-bar';
const courseId = '123';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: mockPathname,
  }),
}));

const RootWrapper = () => (
  <AppProvider store={store}>
    <IntlProvider locale="en" messages={{}}>
      <AdvancedSettings intl={injectIntl} courseId={courseId} />
    </IntlProvider>
  </AppProvider>
);

describe('<AdvancedSettings />', () => {
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
      .onGet(getCourseAdvancedSettingsApiUrl(courseId))
      .reply(200, advancedSettingsMock);
  });

  it('test 1', () => {
    const { getByText, debug } = render(<RootWrapper />);
    debug()
    expect(getByText('Settings')).toBeInTheDocument();
    expect(getByText('Advanced settings')).toBeInTheDocument();
  });

  it('test 2', () => {
    const { getByText } = render(<RootWrapper />);

    expect(getByText('Manual policy definition')).toBeInTheDocument();
    expect(getByText('Warning:')).toBeInTheDocument();
    expect(getByText('Do not modify these policies unless you are familiar with their purpose.')).toBeInTheDocument();
  });

  it('test 3', () => {
    const { getByText } = render(<RootWrapper />);
    const showDeprecatedSettings = getByText('Show Deprecated Settings');

    expect(getByText('Show Deprecated Settings')).toBeInTheDocument();

    act(() => {
      fireEvent.click(showDeprecatedSettings);
    });

    expect(getByText('Hide Deprecated Settings')).toBeInTheDocument();
  });
});

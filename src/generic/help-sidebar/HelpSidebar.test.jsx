import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { AppProvider } from '@edx/frontend-platform/react';
import { initializeMockApp } from '@edx/frontend-platform';
import initializeStore from '../../store';
import messages from './messages';
import HelpSidebar from '.';

const mockPathname = '/foo-bar';

let store;
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: mockPathname,
  }),
}));

const RootWrapper = () => (
  <AppProvider store={store} messages={{}}>
    <IntlProvider locale="en">
      <HelpSidebar
        courseId="course123"
        showOtherSettings
        proctoredExamSettingsUrl=""
      >
        <p>Test children</p>
      </HelpSidebar>
    </IntlProvider>
  </AppProvider>
);

describe('HelpSidebar', () => {
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

  it('renders children correctly', () => {
    const { getByText } = render(<RootWrapper />);
    expect(getByText('Test children')).toBeTruthy();
  });
  it('should render all sidebar links with correct text', () => {
    const { getByText } = render(<RootWrapper />);
    expect(getByText(messages.sidebarTitleOther.defaultMessage)).toBeTruthy();
    expect(getByText(messages.sidebarLinkToScheduleAndDetails.defaultMessage)).toBeTruthy();
    expect(getByText(messages.sidebarLinkToGrading.defaultMessage)).toBeTruthy();
    expect(getByText(messages.sidebarLinkToCourseTeam.defaultMessage)).toBeTruthy();
    expect(getByText(messages.sidebarLinkToGroupConfigurations.defaultMessage)).toBeTruthy();
    expect(getByText(messages.sidebarLinkToAdvancedSettings.defaultMessage)).toBeTruthy();
    expect(getByText(messages.sidebarLinkToProctoredExamSettings.defaultMessage)).toBeTruthy();
  });
});

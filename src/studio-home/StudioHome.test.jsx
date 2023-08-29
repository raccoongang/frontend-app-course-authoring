import React from 'react';
import { useSelector } from 'react-redux';
import { initializeMockApp } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { IntlProvider, injectIntl } from '@edx/frontend-platform/i18n';
import { AppProvider } from '@edx/frontend-platform/react';
import { render } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';

import initializeStore from '../store';
import { COURSE_CREATOR_STATES } from '../constants';
import { studioHomeMock } from './__mocks__';
import { getStudioHomeApiUrl } from './data/api';
import messages from './messages';
import { StudioHome } from '.';

let axiosMock;
let store;
const mockPathname = '/foo-bar';
const {
  studioShortName,
  studioRequestEmail,
} = studioHomeMock;

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

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
    axiosMock.onGet(getStudioHomeApiUrl()).reply(200, studioHomeMock);
    useSelector.mockReturnValue(studioHomeMock);
  });

  it('should render page and page title correctly', async () => {
    const { getByText } = render(<RootWrapper />);
    expect(getByText(`${studioShortName} home`)).toBeInTheDocument();
  });

  it('should render email staff header button', async () => {
    useSelector.mockReturnValue({
      ...studioHomeMock,
      courseCreatorStatus: COURSE_CREATOR_STATES.disallowedForThisSite,
    });

    const { getByRole } = render(<RootWrapper />);
    expect(getByRole('link', { name: messages.emailStaffBtnText.defaultMessage }))
      .toHaveAttribute('href', `mailto:${studioRequestEmail}`);
  });

  it('should render create new course button', async () => {
    useSelector.mockReturnValue({
      ...studioHomeMock,
      courseCreatorStatus: COURSE_CREATOR_STATES.granted,
    });

    const { getByRole } = render(<RootWrapper />);
    expect(getByRole('button', { name: messages.addNewCourseBtnText.defaultMessage })).toBeInTheDocument();
  });
});

import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { AppProvider } from '@edx/frontend-platform/react';
import { initializeMockApp, getConfig } from '@edx/frontend-platform';

import messages from '../messages';
import initializeStore from '../../store';
import CardItem from '.';

let store;
const props = {
  displayName: 'Artificial intelligence',
  lmsLink: '/lms-artificial-intelligence',
  rerunLink: '/artificial-intelligence-rerun',
  org: 'Oxford',
  number: '123',
  isLibraries: false,
  url: '/artificial-intelligence',
};

const RootWrapper = () => (
  <AppProvider store={store}>
    <IntlProvider locale="en" messages={{}}>
      <CardItem intl={{ formatMessage: jest.fn() }} {...props} />
    </IntlProvider>
  </AppProvider>
);

describe('<CardItem />', () => {
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
  it('should render course details for non-library course', () => {
    const { getByText } = render(<RootWrapper />);
    expect(getByText(/Oxford/i)).toBeInTheDocument();
    expect(getByText(/123/i)).toBeInTheDocument();
  });
  it('should render correct links for non-library course', () => {
    const { getByText } = render(<RootWrapper />);
    const courseTitleLink = getByText('Artificial intelligence');
    expect(courseTitleLink).toHaveAttribute('href', `${getConfig().STUDIO_BASE_URL}/artificial-intelligence`);
    const rerunCourseLink = getByText(messages.btnReRunText.defaultMessage);
    expect(rerunCourseLink).toHaveAttribute('href', '/artificial-intelligence-rerun');
    const viewLiveLink = getByText(messages.viewLiveBtnText.defaultMessage);
    expect(viewLiveLink).toHaveAttribute('href', '/lms-artificial-intelligence');
  });
  it('should render course details for library course', () => {
    props.isLibraries = true;
    const { getByText } = render(<RootWrapper />);
    const courseTitleLink = getByText('Artificial intelligence');
    expect(courseTitleLink).toHaveAttribute('href', `${getConfig().STUDIO_BASE_URL}/artificial-intelligence`);
    expect(getByText(/Oxford/i)).toBeInTheDocument();
    expect(getByText(/123/i)).toBeInTheDocument();
  });
});

import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { AppProvider } from '@edx/frontend-platform/react';
import { initializeMockApp, getConfig } from '@edx/frontend-platform';

import { studioHomeMock } from '../__mocks__';
import messages from '../messages';
import initializeStore from '../../store';
import CardItem from '.';

let store;
const props = studioHomeMock.archivedCourses[0];

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
    expect(getByText(`${props.org} / ${props.number}`)).toBeInTheDocument();
  });
  it('should render correct links for non-library course', () => {
    const { getByText } = render(<RootWrapper />);
    const courseTitleLink = getByText(props.displayName);
    expect(courseTitleLink).toHaveAttribute('href', `${getConfig().STUDIO_BASE_URL}${props.url}`);
    const btnReRunCourse = getByText(messages.btnReRunText.defaultMessage);
    expect(btnReRunCourse).toHaveAttribute('href', props.rerunLink);
    const viewLiveLink = getByText(messages.viewLiveBtnText.defaultMessage);
    expect(viewLiveLink).toHaveAttribute('href', props.lmsLink);
  });
  it('should render course details for library course', () => {
    props.isLibraries = true;
    const { getByText } = render(<RootWrapper />);
    const courseTitleLink = getByText(props.displayName);
    expect(courseTitleLink).toHaveAttribute('href', `${getConfig().STUDIO_BASE_URL}${props.url}`);
    expect(getByText(`${props.org} / ${props.number}`)).toBeInTheDocument();
  });
});

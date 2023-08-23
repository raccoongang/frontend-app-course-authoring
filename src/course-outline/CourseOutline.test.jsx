import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { AppProvider } from '@edx/frontend-platform/react';
import { initializeMockApp } from '@edx/frontend-platform';
import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import initializeStore from '../store';
import { executeThunk } from '../utils';
import { getCourseOutlineIndexApiUrl, getUpdateCourseSectionApiUrl } from './data/api';
import { editCourseSectionQuery } from './data/thunk';
import { courseOutlineIndexMock } from './__mocks__';
import CourseOutline from './CourseOutline';
import messages from './messages';

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
    <IntlProvider locale="en">
      <CourseOutline courseId={courseId} />
    </IntlProvider>
  </AppProvider>
);

describe('<CourseOutline />', () => {
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
      .onGet(getCourseOutlineIndexApiUrl(courseId))
      .reply(200, courseOutlineIndexMock);
  });

  it('render CourseOutline component correctly', async () => {
    const { getByText, debug } = render(<RootWrapper />);

    await waitFor(() => {
      debug();
      expect(getByText(messages.headingTitle.defaultMessage)).toBeInTheDocument();
      expect(getByText(messages.headingSubtitle.defaultMessage)).toBeInTheDocument();
    });
  });

  it('check updated section when edit query is successfully', async () => {
    const { getByText } = render(<RootWrapper />);
    const newDisplayName = 'New section name';

    const section = courseOutlineIndexMock.courseStructure.childInfo.children[0];

    axiosMock
      .onPost(getUpdateCourseSectionApiUrl(section.id, {
        metadata: {
          display_name: newDisplayName,
        },
      }))
      .reply(200);

    await executeThunk(editCourseSectionQuery(section.id, newDisplayName), store.dispatch);

    await waitFor(() => {
      expect(getByText(section.displayName)).toBeInTheDocument();
    });
  });
});

import React from 'react';
import { initializeMockApp } from '@edx/frontend-platform';
import { IntlProvider, injectIntl } from '@edx/frontend-platform/i18n';
import { AppProvider } from '@edx/frontend-platform/react';
import { render, waitFor } from '@testing-library/react';

import initializeStore from '../store';
import messages from './messages';
import CourseImportPage from './CourseImportPage';

let store;
const courseId = '123';

const RootWrapper = () => (
  <AppProvider store={store}>
    <IntlProvider locale="en" messages={{}}>
      <CourseImportPage intl={injectIntl} courseId={courseId} />
    </IntlProvider>
  </AppProvider>
);

describe('<CourseImportPage />', () => {
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
  it('should render without errors', async () => {
    const { getByText } = render(<RootWrapper />);
    await waitFor(() => {
      expect(getByText(messages.headingSubtitle.defaultMessage)).toBeInTheDocument();
      const importPageElement = getByText(messages.headingTitle.defaultMessage, {
        selector: 'h2.sub-header-title',
      });
      expect(importPageElement).toBeInTheDocument();
      expect(getByText(messages.description1.defaultMessage)).toBeInTheDocument();
      expect(getByText(messages.description2.defaultMessage)).toBeInTheDocument();
      expect(getByText(messages.description3.defaultMessage)).toBeInTheDocument();
    });
  });
});

import React from 'react';
import { IntlProvider, injectIntl } from '@edx/frontend-platform/i18n';
import { AppProvider } from '@edx/frontend-platform/react';
import { initializeMockApp } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { render, waitFor, fireEvent } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';

import initializeStore from '../store';
import { getGradingSettingsApiUrl } from './data/api';
import gradingSettings from './__mocks__/gradingSettings';
import GradingSettings from './GradingSettings';
import messages from './messages';

const courseId = '123';
let axiosMock;
let store;

const RootWrapper = () => (
  <AppProvider store={store}>
    <IntlProvider locale="en" messages={{}}>
      <GradingSettings intl={injectIntl} courseId={courseId} />
    </IntlProvider>
  </AppProvider>
);

describe('<GradingSettings />', () => {
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
      .onGet(`${getGradingSettingsApiUrl(courseId)}`)
      .reply(200, gradingSettings);
  });

  it('should render without errors', async () => {
    const { getByText } = render(<RootWrapper />);
    await waitFor(() => {
      expect(getByText(messages.headingSubtitle.defaultMessage)).toBeInTheDocument();
      expect(getByText(messages.headingTitle.defaultMessage)).toBeInTheDocument();
      expect(getByText(messages.policy.defaultMessage)).toBeInTheDocument();
      expect(getByText(messages.policiesDescription.defaultMessage)).toBeInTheDocument();
    });
  });

  it('renders grading scale ticks', async () => {
    const { getAllByTestId } = render(<RootWrapper />);
    await waitFor(() => {
      const ticks = getAllByTestId('grading-scale-tick');
      expect(ticks).toHaveLength(11); // 0 to 100, inclusive, with step 10
    });
  });

  it('renders grading scale segments', async () => {
    const { getAllByTestId } = render(<RootWrapper />);
    await waitFor(() => {
      const segments = getAllByTestId('grading-scale-segment');
      expect(segments).toHaveLength(5);
    });
  });
  it('should add a new grading segment when "Add new grading segment" button is clicked', async () => {
    const { getByRole, getAllByTestId } = render(<RootWrapper />);
    await waitFor(() => {
      const addNewSegmentBtn = getByRole('button', {
        name: 'Add new grading segment',
      });
      expect(addNewSegmentBtn).toBeInTheDocument();
      fireEvent.click(addNewSegmentBtn);
      const segments = getAllByTestId('grading-scale-segment');
      expect(segments).toHaveLength(6);
    });
  });
  it('should remove grading segment when "Remove" button is clicked', async () => {
    const { getAllByTestId } = render(<RootWrapper />);
    await waitFor(() => {
      const segments = getAllByTestId('grading-scale-segment');
      const btn = getAllByTestId('grading-scale-btn-remove');
      fireEvent.click(btn[1]);
      expect(segments).toHaveLength(5);
    });
  });
});

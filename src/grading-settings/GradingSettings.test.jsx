import React from 'react';
import { IntlProvider, injectIntl } from '@edx/frontend-platform/i18n';
import { AppProvider } from '@edx/frontend-platform/react';
import { initializeMockApp } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { render, waitForElementToBeRemoved } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import { getGradingSettingsApiUrl } from './data/api';

import initializeStore from '../store';

import GradingSettings from './GradingSettings';

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
      .reply(200, {
        mfeProctoredExamSettingsUrl: '',
        courseAssignmentLists: {},
        courseDetails: {
          graders: [
            {
              type: 'Homework',
              minCount: 0,
              dropCount: 0,
              shortLabel: null,
              weight: 15,
              id: 0,
            },
            {
              type: 'Lab',
              minCount: 0,
              dropCount: 0,
              shortLabel: null,
              weight: 15,
              id: 1,
            },
            {
              type: 'Midterm Exam',
              minCount: 0,
              dropCount: 0,
              shortLabel: null,
              weight: 30,
              id: 2,
            },
            {
              type: 'Final Exam',
              minCount: 0,
              dropCount: 0,
              shortLabel: null,
              weight: 40,
              id: 3,
            },
          ],
          gradeCutoffs: {
            a: 0.72,
            d: 0.71,
            c: 0.31,
          },
          gracePeriod: null,
          minimumGradeCredit: 0.8,
        },
        showCreditEligibility: false,
        isCreditCourse: false,
      });
  });

  it('should render without errors', async () => {
    const { getByText, getByRole } = render(<RootWrapper />);
    await waitForElementToBeRemoved(getByRole('status'));

    const textarea = getByText(/Grading/i);
    expect(textarea).toBeInTheDocument();
  });
});

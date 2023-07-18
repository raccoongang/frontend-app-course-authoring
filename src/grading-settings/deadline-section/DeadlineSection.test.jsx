import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import DeadlineSection from '.';
import messages from './messages';

const gracePeriodDefaultTime = {
  hours: 12, minutes: 12,
};

const RootWrapper = () => (
  <IntlProvider locale="en">
    <DeadlineSection
      setShowSavePrompt={jest.fn()}
      gracePeriod={gracePeriodDefaultTime}
      setGradingData={jest.fn()}
      setShowSuccessAlert={jest.fn()}
    />
  </IntlProvider>
);

describe('<DeadlineSection />', () => {
  it('checking deadline label and description text', async () => {
    const { getByText } = render(<RootWrapper />);
    await waitFor(() => {
      expect(getByText(messages.gracePeriodOnDeadlineLabel.defaultMessage)).toBeInTheDocument();
      expect(getByText(messages.gracePeriodOnDeadlineDescription.defaultMessage)).toBeInTheDocument();
    });
  });
  it('checking deadline input value', async () => {
    const { getByTestId } = render(<RootWrapper />);
    await waitFor(() => {
      const inputElement = getByTestId('deadline-period-input');
      expect(inputElement.value).toBe('12:12');
    });
  });
});

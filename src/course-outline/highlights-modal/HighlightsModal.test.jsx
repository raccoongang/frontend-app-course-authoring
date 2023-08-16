import React from 'react';
import {
  render, fireEvent, act, waitFor,
} from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import HighlightsModal from './HighlightsModal';
import messages from './messages';

const onSubmitMock = jest.fn();
const onCloseMock = jest.fn();

const currentSectionMock = {
  displayName: 'Title',
  highlights: ['highlight1', 'highlight2'],
};

const renderComponent = (props) => render(
  <IntlProvider locale="en">
    <HighlightsModal
      isOpen
      onClose={onCloseMock}
      onSubmit={onSubmitMock}
      currentSection={currentSectionMock}
      learnMoreVisibilityUrl="https://example.com"
      {...props}
    />
  </IntlProvider>,
);

describe('<HighlightsModal />', () => {
  it('renders HighlightsModal component correctly', () => {
    const { getByText, getByRole, getByLabelText } = renderComponent();

    expect(getByText(/Highlights for Title/i)).toBeInTheDocument();
    expect(getByText(/Enter 3-5 highlights to include in the email message that learners receive for this section/i)).toBeInTheDocument();
    expect(getByText(/For more information and an example of the email template, read our/i)).toBeInTheDocument();
    expect(getByText(messages.documentationLink.defaultMessage)).toBeInTheDocument();
    expect(getByLabelText(messages.highlight_1.defaultMessage)).toBeInTheDocument();
    expect(getByLabelText(messages.highlight_2.defaultMessage)).toBeInTheDocument();
    expect(getByLabelText(messages.highlight_3.defaultMessage)).toBeInTheDocument();
    expect(getByLabelText(messages.highlight_4.defaultMessage)).toBeInTheDocument();
    expect(getByLabelText(messages.highlight_5.defaultMessage)).toBeInTheDocument();
    expect(getByRole('button', { name: messages.cancelButton.defaultMessage })).toBeInTheDocument();
    expect(getByRole('button', { name: messages.saveButton.defaultMessage })).toBeInTheDocument();
  });

  it('calls the onClose function when the cancel button is clicked', () => {
    const { getByRole } = renderComponent();

    const cancelButton = getByRole('button', { name: messages.cancelButton.defaultMessage });
    fireEvent.click(cancelButton);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('calls the onSubmit function with correct values when the save button is clicked', async () => {
    const { getByRole, getByLabelText } = renderComponent();

    const field1 = getByLabelText(messages.highlight_1.defaultMessage);
    const field2 = getByLabelText(messages.highlight_2.defaultMessage);
    fireEvent.change(field1, { target: { value: 'Highlights 1' } });
    fireEvent.change(field2, { target: { value: 'Highlights 2' } });

    const saveButton = getByRole('button', { name: messages.saveButton.defaultMessage });

    await act(async () => {
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith(
        {
          highlight_1: 'Highlights 1',
          highlight_2: 'Highlights 2',
          highlight_3: '',
          highlight_4: '',
          highlight_5: '',
        },
        expect.objectContaining({ submitForm: expect.any(Function) }),
      );
    });
  });
});

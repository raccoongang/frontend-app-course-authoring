import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import DeleteModal from './DeleteModal';
import messages from './messages';

const onDeleteSubmitMock = jest.fn();
const closeMock = jest.fn();

const renderComponent = (props) => render(
  <IntlProvider locale="en">
    <DeleteModal
      isOpen
      close={closeMock}
      onDeleteSubmit={onDeleteSubmitMock}
      {...props}
    />
  </IntlProvider>,
);

describe('<DeleteModal />', () => {
  it('render DeleteModal component correctly', () => {
    const { getByText, getByRole } = renderComponent();

    expect(getByText(messages.title.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.description.defaultMessage)).toBeInTheDocument();
    expect(getByRole('button', { name: messages.cancelButton.defaultMessage })).toBeInTheDocument();
    expect(getByRole('button', { name: messages.deleteButton.defaultMessage })).toBeInTheDocument();
  });

  it('calls onDeleteSubmit function when the "Delete" button is clicked', () => {
    const { getByRole } = renderComponent();

    const okButton = getByRole('button', { name: messages.deleteButton.defaultMessage });
    fireEvent.click(okButton);
    expect(onDeleteSubmitMock).toHaveBeenCalledTimes(1);
  });

  it('calls the close function when the "Cancel" button is clicked', () => {
    const { getByRole } = renderComponent();

    const cancelButton = getByRole('button', { name: messages.cancelButton.defaultMessage });
    fireEvent.click(cancelButton);
    expect(closeMock).toHaveBeenCalledTimes(1);
  });
});

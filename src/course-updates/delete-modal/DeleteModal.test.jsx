import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import DeleteModal from './DeleteModal';
import messages from '../messages';

const closeMock = jest.fn();
const onDeleteSubmitMock = jest.fn();

const RootWrapper = () => (
  <IntlProvider locale="en">
    <DeleteModal
      isOpen
      close={closeMock}
      onDeleteSubmit={onDeleteSubmitMock}
    />
  </IntlProvider>
);

describe('<DeleteModal />', () => {
  it('render DeleteModal component correctly', () => {
    const { getByText } = render(<RootWrapper />);

    expect(getByText(messages.deleteModal.title.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.deleteModal.description.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.buttons.cancel.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.buttons.ok.defaultMessage)).toBeInTheDocument();
  });

  it('calls Cancel and Ok button is clicked', () => {
    const { getByText } = render(<RootWrapper />);

    const cancelButton = getByText(messages.buttons.cancel.defaultMessage);
    fireEvent.click(cancelButton);
    expect(closeMock).toHaveBeenCalledTimes(1);

    const deleteButton = getByText(messages.buttons.ok.defaultMessage);
    fireEvent.click(deleteButton);
    expect(onDeleteSubmitMock).toHaveBeenCalledTimes(1);
  });
});

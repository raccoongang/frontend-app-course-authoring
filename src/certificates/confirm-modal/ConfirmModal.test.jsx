import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import messages from '../certificates-card/messages';
import ConfirmModal from './ConfirmModal';

const renderComponent = (props) => render(
  <IntlProvider locale="en">
    <ConfirmModal {...props} />
  </IntlProvider>,
);

const defaultProps = {
  isOpen: true,
  title: messages.deleteSignatoryConfirmation.defaultMessage,
  message: messages.deleteSignatoryConfirmationMessage.defaultMessage,
  cancelButtonText: messages.cancelModal.defaultMessage,
  actionButtonText: messages.deleteTooltip.defaultMessage,
  handleCancel: jest.fn(),
  handleAction: jest.fn(),
};

describe('ConfirmModal', () => {
  it('renders the modal with the correct content', () => {
    const { getByText, getByRole } = renderComponent(defaultProps);
    const modal = getByRole('dialog');

    expect(modal).toBeInTheDocument();
    expect(getByText(defaultProps.title)).toBeInTheDocument();
    expect(getByText(defaultProps.message)).toBeInTheDocument();
    expect(getByText(defaultProps.cancelButtonText)).toBeInTheDocument();
    expect(getByText(defaultProps.actionButtonText)).toBeInTheDocument();
  });

  it('calls handleCancel when the cancel button is clicked', () => {
    const { getByRole } = renderComponent(defaultProps);
    const cancelButton = getByRole('button', { name: defaultProps.cancelButtonText });

    userEvent.click(cancelButton);

    expect(defaultProps.handleCancel).toHaveBeenCalled();
  });

  it('calls handleAction when the confirm button is clicked', () => {
    const { getByRole } = renderComponent(defaultProps);
    const actionButton = getByRole('button', { name: defaultProps.actionButtonText });

    userEvent.click(actionButton);

    expect(defaultProps.handleAction).toHaveBeenCalled();
  });

  it('does not render the modal when isOpen is false', () => {
    const { queryByText } = renderComponent({ ...defaultProps, isOpen: false });

    expect(queryByText(defaultProps.title)).not.toBeInTheDocument();
    expect(queryByText(defaultProps.message)).not.toBeInTheDocument();
  });
});

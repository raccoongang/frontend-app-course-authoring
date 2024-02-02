import { AppProvider } from '@edx/frontend-platform/react';
import {
  fireEvent, render, act, waitFor,
} from '@testing-library/react';
import { initializeMockApp } from '@edx/frontend-platform';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import initializeStore from '../../store';
import ModalDropzone from './ModalDropzone';
import messages from './messages';

let store;

const RootWrapper = (props) => (
  <IntlProvider locale="en">
    <AppProvider store={store}>
      <ModalDropzone {...props} />
    </AppProvider>
  </IntlProvider>
);

const mockOnClose = jest.fn();
const mockOnCancel = jest.fn();
const mockOnChange = jest.fn();

const props = {
  isOpen: true,
  onClose: mockOnClose,
  onCancel: mockOnCancel,
  onChange: mockOnChange,
};

describe('<ModalDropzone />', () => {
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
    jest.clearAllMocks();
  });

  it('renders successfully when open', () => {
    const { getByText } = render(<RootWrapper {...props} />);
    expect(getByText(messages.uploadImageDropzoneText.defaultMessage)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const { getByText } = render(<RootWrapper {...props} />);
    fireEvent.click(getByText(messages.cancelModal.defaultMessage));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const { getByText } = render(<RootWrapper {...props} />);
    fireEvent.click(getByText(messages.cancelModal.defaultMessage));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('disables the upload button initially', () => {
    const { getByText } = render(<RootWrapper {...props} />);
    const uploadButton = getByText(messages.uploadModal.defaultMessage);
    expect(uploadButton).toBeDisabled();
  });

  it('enables the upload button after a file is selected', async () => {
    const { getByText, getByRole } = render(<RootWrapper {...props} />);
    const dropzoneInput = getByRole('presentation');

    await act(async () => {
      fireEvent.change(dropzoneInput, { target: { files: ['test-file.png'] } });
    });
    waitFor(() => {
      const uploadButton = getByText(messages.uploadModal.defaultMessage);
      expect(uploadButton).not.toBeDisabled();
    });
  });
});

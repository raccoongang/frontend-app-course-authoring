import {
  render, fireEvent, waitFor, act,
} from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import { MODE_STATES } from '../../../data/constants';
import messages from '../../messages';
import Signatory from './Signatory';

jest.mock('@edx/frontend-platform/i18n', () => ({
  ...jest.requireActual('@edx/frontend-platform/i18n'),
  useIntl: () => ({
    formatMessage: (message) => message.defaultMessage,
  }),
}));
jest.mock('@edx/frontend-platform/i18n', () => ({
  ...jest.requireActual('@edx/frontend-platform/i18n'),
  getConfig: () => ({ STUDIO_BASE_URL: 'http://localhost' }),
}));

const renderSignatory = (props) => render(
  <IntlProvider locale="en">
    <Signatory {...props} />
  </IntlProvider>,
);

describe('Signatory Component', () => {
  const defaultProps = {
    id: 0,
    name: 'John Doe',
    title: 'Director',
    organization: 'Organization',
    signatureImagePath: '/path/to/image.png',
    showDeleteButton: true,
  };

  it('renders in CREATE mode', () => {
    const { queryByTestId, getByPlaceholderText } = renderSignatory({ ...defaultProps, mode: MODE_STATES.CREATE });
    expect(queryByTestId('signatory-view')).not.toBeInTheDocument();
    expect(getByPlaceholderText(messages.namePlaceholder.defaultMessage)).toBeInTheDocument();
  });

  it('renders in VIEW mode', () => {
    const { getByText, queryByText } = renderSignatory({ ...defaultProps, mode: MODE_STATES.VIEW });
    expect(getByText('John Doe')).toBeInTheDocument();
    expect(getByText('Director')).toBeInTheDocument();
    expect(queryByText(messages.namePlaceholder.defaultMessage)).not.toBeInTheDocument();
  });

  it('handles input change', async () => {
    const handleChange = jest.fn();
    const { getByPlaceholderText } = renderSignatory({ ...defaultProps, mode: MODE_STATES.CREATE, handleChange });
    const input = getByPlaceholderText(messages.namePlaceholder.defaultMessage);

    await act(async () => {
      fireEvent.change(input, { target: { value: 'Jane Doe', name: 'signatories[0].name' } });
    });

    waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith(expect.anything());
      expect(input.value).toBe('Jane Doe');
    });
  });

  it('opens image upload modal on button click', () => {
    const { getByText, getByRole, queryByRole } = renderSignatory({ ...defaultProps, mode: MODE_STATES.CREATE });
    const uploadButton = getByText(messages.uploadImageButton.defaultMessage);

    expect(queryByRole('presentation')).not.toBeInTheDocument();

    fireEvent.click(uploadButton);

    expect(getByRole('presentation')).toBeInTheDocument();
  });

  it('shows confirm modal on delete button click', async () => {
    const { getByLabelText, getByText } = renderSignatory({ ...defaultProps, mode: MODE_STATES.CREATE });
    const deleteButton = getByLabelText(messages.deleteTooltip.defaultMessage);
    fireEvent.click(deleteButton);
    expect(getByText(`Delete "${defaultProps.name}" from the list of signatories?`)).toBeInTheDocument();
  });
});

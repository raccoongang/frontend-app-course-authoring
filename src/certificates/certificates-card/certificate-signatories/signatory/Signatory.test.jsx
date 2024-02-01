import { render, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

const defaultProps = {
  id: 0,
  name: 'John Doe',
  title: 'Director',
  organization: 'Organization',
  signatureImagePath: '/path/to/image.png',
  showDeleteButton: true,
};

describe('Signatory Component', () => {
  it('renders in CREATE mode', () => {
    const { queryByTestId, getByPlaceholderText } = renderSignatory(
      { ...defaultProps, componentMode: MODE_STATES.create },
    );
    expect(queryByTestId('signatory-view')).not.toBeInTheDocument();
    expect(getByPlaceholderText(messages.namePlaceholder.defaultMessage)).toBeInTheDocument();
  });

  it('renders in VIEW mode', () => {
    const { getByText, queryByText } = renderSignatory({ ...defaultProps, mode: MODE_STATES.view });
    expect(getByText(defaultProps.name)).toBeInTheDocument();
    expect(getByText(defaultProps.title)).toBeInTheDocument();
    expect(queryByText(messages.namePlaceholder.defaultMessage)).not.toBeInTheDocument();
  });

  it('handles input change', async () => {
    const handleChange = jest.fn();
    const { getByPlaceholderText } = renderSignatory(
      { ...defaultProps, componentMode: MODE_STATES.create, handleChange },
    );
    const input = getByPlaceholderText(messages.namePlaceholder.defaultMessage);

    await act(async () => {
      userEvent.type(input, 'Jane Doe', { name: 'signatories[0].name' });
    });

    waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith(expect.anything());
      expect(input.value).toBe('Jane Doe');
    });
  });

  it('opens image upload modal on button click', () => {
    const { getByRole, queryByRole } = renderSignatory(
      { ...defaultProps, componentMode: MODE_STATES.create },
    );
    const uploadButton = getByRole('button', { name: messages.uploadImageButton.defaultMessage });

    expect(queryByRole('presentation')).not.toBeInTheDocument();

    userEvent.click(uploadButton);

    expect(getByRole('presentation')).toBeInTheDocument();
  });
});
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { initializeMockApp } from '@edx/frontend-platform';

import initializeStore from '../../../../store';
import { MODE_STATES } from '../../../data/constants';
import { signatoriesMock } from '../../../__mocks__';
import messages from '../../messages';
import Signatory from './Signatory';

let store;

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
  <Provider store={store}>
    <IntlProvider locale="en">
      <Signatory {...props} />
    </IntlProvider>,
  </Provider>,
);

const initialState = {
  certificates: {
    certificatesData: {
      certificates: [],
      hasCertificateModes: true,
    },
    componentMode: MODE_STATES.create,
  },
};

const defaultProps = signatoriesMock[0];

describe('Signatory Component', () => {
  beforeEach(() => {
    initializeMockApp({
      authenticatedUser: {
        userId: 3,
        username: 'abc123',
        administrator: true,
        roles: [],
      },
    });
    store = initializeStore(initialState);
  });
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
    const newInputValue = 'Jane Doe';

    userEvent.type(input, newInputValue, { name: 'signatories[0].name' });

    waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith(expect.anything());
      expect(input.value).toBe(newInputValue);
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

  it('shows confirm modal on delete icon click', async () => {
    const { getByLabelText, getByText } = renderSignatory(
      { ...defaultProps, componentMode: MODE_STATES.create, showDeleteButton: true },
    );
    const deleteIcon = getByLabelText(messages.deleteTooltip.defaultMessage);

    userEvent.click(deleteIcon);

    expect(getByText(`Delete "${defaultProps.name}" from the list of signatories?`)).toBeInTheDocument();
    expect(getByText(messages.deleteSignatoryConfirmation.defaultMessage
      .replace('{name}', defaultProps.name))).toBeInTheDocument();
  });
});

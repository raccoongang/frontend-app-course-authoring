import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { initializeMockApp } from '@edx/frontend-platform';

import initializeStore from '../../../store';
import { MODE_STATES } from '../../data/constants';
import { signatoriesMock } from '../../__mocks__';
import messages from '../messages';
import CertificateSignatories from './CertificateSignatories';

let store;

const mockArrayHelpers = {
  push: jest.fn(),
  remove: jest.fn(),
};

const renderComponent = (props) => render(
  <Provider store={store}>
    <IntlProvider locale="en">
      <CertificateSignatories {...props} />
    </IntlProvider>,
  </Provider>,
);

const defaultProps = {
  signatories: signatoriesMock,
  componentMode: MODE_STATES.view,
  arrayHelpers: mockArrayHelpers,
};

const initialState = {
  certificates: {
    certificatesData: {
      certificates: [],
      hasCertificateModes: true,
    },
    componentMode: MODE_STATES.create,
  },
};

describe('CertificateSignatories', () => {
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

  afterEach(() => jest.clearAllMocks());

  it('renders signatory components for each signatory', () => {
    const { getByText } = renderComponent(defaultProps);

    signatoriesMock.forEach(signatory => {
      expect(getByText(signatory.name)).toBeInTheDocument();
      expect(getByText(signatory.title)).toBeInTheDocument();
      expect(getByText(signatory.organization)).toBeInTheDocument();
    });
  });

  it('adds a new signatory when add button is clicked', () => {
    const { getByText } = renderComponent({ ...defaultProps, componentMode: MODE_STATES.create });

    userEvent.click(getByText(messages.addSignatoryButton.defaultMessage));
    expect(mockArrayHelpers.push).toHaveBeenCalledWith({
      name: '',
      title: '',
      organization: '',
      signatureImagePath: '',
    });
  });

  it('calls remove for the correct signatory when delete icon is clicked', async () => {
    const { getAllByRole } = renderComponent({ ...defaultProps, componentMode: MODE_STATES.create });

    const deleteIcons = getAllByRole('button', { name: messages.deleteTooltip.defaultMessage });
    expect(deleteIcons.length).toBe(signatoriesMock.length);

    userEvent.click(deleteIcons[0]);

    waitFor(() => {
      expect(mockArrayHelpers.remove).toHaveBeenCalledWith(0);
    });
  });
});

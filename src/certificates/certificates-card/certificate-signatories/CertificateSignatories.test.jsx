import {
  render, fireEvent, waitFor, act,
} from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import { MODE_STATES } from '../../data/constants';
import messages from '../messages';
import CertificateSignatories from './CertificateSignatories';

describe('CertificateSignatories', () => {
  const mockSignatories = [
    {
      id: '1', name: 'John Doe', title: 'CEO', organization: 'Company', signatureImagePath: '/path/to/signature1.png',
    },
    {
      id: '2', name: 'Jane Doe', title: 'CFO', organization: 'Company 2', signatureImagePath: '/path/to/signature2.png',
    },
  ];

  const mockArrayHelpers = {
    push: jest.fn(),
    remove: jest.fn(),
  };

  const defaultProps = {
    signatories: mockSignatories,
    mode: MODE_STATES.VIEW,
    arrayHelpers: mockArrayHelpers,
  };

  const renderComponent = (props) => render(
    <IntlProvider locale="en">
      <CertificateSignatories {...props} />
    </IntlProvider>,
  );

  afterEach(() => jest.clearAllMocks());

  it('renders signatory components for each signatory', () => {
    const { getByText } = renderComponent(defaultProps);

    mockSignatories.forEach(signatory => {
      expect(getByText(signatory.name)).toBeInTheDocument();
      expect(getByText(signatory.title)).toBeInTheDocument();
      expect(getByText(signatory.organization)).toBeInTheDocument();
    });
  });

  it('adds a new signatory when add button is clicked', () => {
    const { getByText } = renderComponent({ ...defaultProps, mode: MODE_STATES.CREATE });

    fireEvent.click(getByText(messages.addSignatoryButton.defaultMessage));
    expect(mockArrayHelpers.push).toHaveBeenCalledWith({
      id: expect.any(String),
      name: '',
      title: '',
      organization: '',
      signatureImagePath: '',
    });
  });

  it('calls remove for the correct signatory when delete button is clicked', async () => {
    const { getAllByLabelText } = renderComponent({ ...defaultProps, mode: MODE_STATES.CREATE });

    const deleteButtons = getAllByLabelText(messages.deleteTooltip.defaultMessage);
    expect(deleteButtons.length).toBe(mockSignatories.length);

    await act(async () => {
      fireEvent.click(deleteButtons[0]);
    });

    waitFor(() => {
      expect(mockArrayHelpers.remove).toHaveBeenCalledWith(0);
    });
  });
});

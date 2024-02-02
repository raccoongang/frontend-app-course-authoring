import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import { MODE_STATES } from '../../data/constants';
import { signatoriesMock } from '../../__mocks__';
import messages from '../messages';
import CertificateSignatories from './CertificateSignatories';

const mockArrayHelpers = {
  push: jest.fn(),
  remove: jest.fn(),
};

const renderComponent = (props) => render(
  <IntlProvider locale="en">
    <CertificateSignatories {...props} />
  </IntlProvider>,
);

const defaultProps = {
  signatories: signatoriesMock,
  componentMode: MODE_STATES.view,
  arrayHelpers: mockArrayHelpers,
};

describe('CertificateSignatories', () => {
  afterEach(() => jest.clearAllMocks());

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
});

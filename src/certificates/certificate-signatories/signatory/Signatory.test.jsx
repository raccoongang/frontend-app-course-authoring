import { render } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import userEvent from '@testing-library/user-event';

import { signatoriesMock } from '../../__mocks__';
import commonMessages from '../../messages';
import messages from '../messages';
import Signatory from './Signatory';

jest.mock('@edx/frontend-platform/i18n', () => ({
  ...jest.requireActual('@edx/frontend-platform/i18n'),
  useIntl: () => ({
    formatMessage: (message) => message.defaultMessage,
  }),
  getConfig: () => ({ STUDIO_BASE_URL: 'http://localhost' }),
}));

const mockHandleEdit = jest.fn();

const renderSignatory = (props) => render(
  <IntlProvider locale="en">
    <Signatory {...props} />
  </IntlProvider>,
);

const defaultProps = { ...signatoriesMock[0], handleEdit: mockHandleEdit };

describe('Signatory Component', () => {
  it('renders in VIEW mode', () => {
    const { getByText, queryByText } = renderSignatory(defaultProps);

    expect(getByText(defaultProps.name)).toBeInTheDocument();
    expect(getByText(defaultProps.title)).toBeInTheDocument();
    expect(queryByText(messages.namePlaceholder.defaultMessage)).not.toBeInTheDocument();
  });

  it('calls handleEdit when the edit button is clicked', () => {
    const { getByRole } = renderSignatory(defaultProps);

    const editButton = getByRole('button', { name: commonMessages.editTooltip.defaultMessage });
    userEvent.click(editButton);

    expect(mockHandleEdit).toHaveBeenCalled();
  });
});

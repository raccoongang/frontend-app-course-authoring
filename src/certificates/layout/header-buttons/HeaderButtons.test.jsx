import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { initializeMockApp } from '@edx/frontend-platform';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import initializeStore from '../../../store';
import { certificatesDataMock } from '../../__mocks__';
import messages from '../../messages';
import useHeaderButtons from './hooks/useHeaderButtons';
import HeaderButtons from './HeaderButtons';

let store;

jest.mock('./hooks/useHeaderButtons');

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('@edx/frontend-platform/i18n', () => ({
  ...jest.requireActual('@edx/frontend-platform/i18n'),
  useIntl: () => ({
    formatMessage: (message) => message.defaultMessage,
  }),
}));

const renderComponent = (props) => render(
  <Provider store={store} messages={{}}>
    <IntlProvider locale="en">
      <HeaderButtons {...props} />
    </IntlProvider>
  </Provider>,
);

const initialState = {
  certificates: {
    certificatesData: certificatesDataMock,
  },
};

describe('HeaderButtons Component', () => {
  beforeEach(async () => {
    initializeMockApp({
      authenticatedUser: {
        userId: 3,
        username: 'abc123',
        administrator: true,
        roles: [],
      },
    });
    store = initializeStore(initialState);
    useHeaderButtons.mockReturnValue({
      previewUrl: 'http://example.com?preview=',
      courseModes: certificatesDataMock.courseModes,
      dropdowmItem: certificatesDataMock.courseModes[0],
      isCertificateActive: certificatesDataMock.isActive,
      setDropdowmItem: jest.fn(),
      handleActivationStatus: jest.fn(),
    });
  });
  it('updates preview URL param based on selected dropdown item', async () => {
    const { getByRole } = renderComponent();
    const dropdownButton = getByRole('button', { name: certificatesDataMock.courseModes[0] });
    await userEvent.click(dropdownButton);

    const verifiedMode = await getByRole('button', { name: certificatesDataMock.courseModes[1] });
    await userEvent.click(verifiedMode);

    expect(useHeaderButtons().setDropdowmItem).toHaveBeenCalledWith(certificatesDataMock.courseModes[1]);
  });

  it('activates/deactivates certificate when button is clicked', async () => {
    const { getByRole } = renderComponent();
    const activationButton = getByRole('button', { name: /Activate/i });
    await userEvent.click(activationButton);

    expect(useHeaderButtons().handleActivationStatus).toHaveBeenCalled();
  });

  it('displays correct text on activation/deactivation button based on certificate status', () => {
    useHeaderButtons.mockReturnValueOnce({
      ...useHeaderButtons(),
      isCertificateActive: true,
    });
    const { getByRole, queryByRole } = renderComponent();

    expect(getByRole('button', { name: messages.headingActionsDeactivate.defaultMessage })).toBeInTheDocument();
    expect(queryByRole('button', { name: messages.headingActionsActivate.defaultMessage })).not.toBeInTheDocument();
  });
});

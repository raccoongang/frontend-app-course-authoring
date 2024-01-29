import { render, act } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { AppProvider } from '@edx/frontend-platform/react';
import { initializeMockApp } from '@edx/frontend-platform';
import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import userEvent from '@testing-library/user-event';

import initializeStore from '../../../../store';
import ActionButtons from './ActionButtons';
import { getClipboardUrl, getCourseUnitApiUrl } from '../../../data/api';
import { clipboardUnit, courseUnitIndexMock } from '../../../__mocks__';
import { executeThunk } from '../../../../utils';
import { copyToClipboard, fetchCourseUnitQuery } from '../../../data/thunk';

jest.mock('../../../data/thunk', () => ({
  ...jest.requireActual('../../../data/thunk'),
  copyToClipboard: jest.fn().mockImplementation(() => () => {}),
}));

let store;
let axiosMock;
const courseId = '123';

const renderComponent = (props = {}) => render(
  <AppProvider store={store}>
    <IntlProvider locale="en">
      <ActionButtons {...props} />
    </IntlProvider>
  </AppProvider>,
);

describe('<ActionButtons />', () => {
  beforeEach(async () => {
    initializeMockApp({
      authenticatedUser: {
        userId: 3,
        username: 'abc123',
        administrator: true,
        roles: [],
      },
    });

    store = initializeStore();
    axiosMock = new MockAdapter(getAuthenticatedHttpClient());
    axiosMock
      .onGet(getCourseUnitApiUrl(courseId))
      .reply(200, { ...courseUnitIndexMock, enable_copy_paste_units: true });
    axiosMock
      .onPost(getClipboardUrl())
      .reply(200, clipboardUnit);
    axiosMock
      .onGet(getClipboardUrl())
      .reply(200, clipboardUnit);
    await executeThunk(fetchCourseUnitQuery(courseId), store.dispatch);
  });

  it('render ActionButtons component with Copy to clipboard', () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId('copy-xblock-to-clipboard')).toBeInTheDocument();
  });
  it('click on the Copy to clipboard button updates clipboardData', async () => {
    const { getByTestId } = renderComponent();

    const copyToClipboardButton = getByTestId('copy-xblock-to-clipboard');
    await act(async () => {
      userEvent.click(copyToClipboardButton);
    });
    expect(copyToClipboard).toHaveBeenCalledWith(courseUnitIndexMock.id);
    jest.resetAllMocks();
  });
});
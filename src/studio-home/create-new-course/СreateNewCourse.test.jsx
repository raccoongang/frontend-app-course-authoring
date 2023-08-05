import React from 'react';
import {
  fireEvent, render, act, waitFor,
} from '@testing-library/react';
import { AppProvider } from '@edx/frontend-platform/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { getConfig, initializeMockApp } from '@edx/frontend-platform';
import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import initializeStore from '../../store';
import { organizationsMock } from '../__mocks__';
import messages from './messages';
import CreateNewCourse from '.';

let axiosMock;
let store;

const handleOnClickCancelMock = jest.fn();
const handleOnClickCreateMock = jest.fn();

const RootWrapper = (props) => (
  <IntlProvider locale="en">
    <AppProvider store={store}>
      <CreateNewCourse {...props} />
    </AppProvider>
  </IntlProvider>
);

const props = {
  handleOnClickCancel: handleOnClickCancelMock,
  handleOnClickCreate: handleOnClickCreateMock,
};

describe('<CreateNewCourse />', () => {
  const apiBaseUrl = getConfig().STUDIO_BASE_URL;
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
    axiosMock = new MockAdapter(getAuthenticatedHttpClient());
    axiosMock
      .onGet(`${apiBaseUrl}/organizations`)
      .reply(200, organizationsMock);
  });

  it('renders successfully', () => {
    const { getByText, getByPlaceholderText } = render(
      <RootWrapper {...props} />,
    );
    expect(getByText(messages.createNewCourse.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.courseDisplayNameLabel.defaultMessage)).toBeInTheDocument();
    expect(getByPlaceholderText(messages.courseDisplayNamePlaceholder.defaultMessage)).toBeInTheDocument();

    expect(getByText(messages.courseOrgLabel.defaultMessage)).toBeInTheDocument();
    expect(getByPlaceholderText(messages.courseOrgPlaceholder.defaultMessage)).toBeInTheDocument();

    expect(getByText(messages.courseNumberLabel.defaultMessage)).toBeInTheDocument();
    expect(getByPlaceholderText(messages.courseNumberPlaceholder.defaultMessage)).toBeInTheDocument();

    expect(getByText(messages.courseRunLabel.defaultMessage)).toBeInTheDocument();
    expect(getByPlaceholderText(messages.courseRunPlaceholder.defaultMessage)).toBeInTheDocument();
  });

  it('should call handleOnClickCancel if button cancel clicked', () => {
    const { getByRole } = render(<RootWrapper {...props} />);
    const cancelBtn = getByRole('button', { name: messages.cancelButton.defaultMessage });
    act(() => {
      fireEvent.click(cancelBtn);
    });
    expect(handleOnClickCancelMock).toHaveBeenCalled();
  });

  it('should call handleOnClickCreate if button create clicked', () => {
    const { getByPlaceholderText } = render(<RootWrapper {...props} />);
    const displayNameInput = getByPlaceholderText(messages.courseDisplayNamePlaceholder.defaultMessage);
    const orgInput = getByPlaceholderText(messages.courseOrgPlaceholder.defaultMessage);
    const numberInput = getByPlaceholderText(messages.courseNumberPlaceholder.defaultMessage);
    const runInput = getByPlaceholderText(messages.courseRunPlaceholder.defaultMessage);

    act(() => {
      fireEvent.change(displayNameInput, { target: { value: 'foo course name' } });
      fireEvent.change(orgInput, { target: { value: 'edx' } });
      fireEvent.change(numberInput, { target: { value: '777' } });
      fireEvent.change(runInput, { target: { value: '1' } });
    });

    expect(handleOnClickCancelMock).toHaveBeenCalled();
  });

  it('should be disabled create button if form not filled', () => {
    const { getByRole } = render(<RootWrapper {...props} />);
    const createBtn = getByRole('button', { name: messages.createButton.defaultMessage });
    expect(createBtn).toBeDisabled();
  });

  it('should be disabled create button if form has error', () => {
    const { getByRole, getByPlaceholderText } = render(<RootWrapper {...props} />);
    const createBtn = getByRole('button', { name: messages.createButton.defaultMessage });
    const displayNameInput = getByPlaceholderText(messages.courseDisplayNamePlaceholder.defaultMessage);
    const orgInput = getByPlaceholderText(messages.courseOrgPlaceholder.defaultMessage);
    const numberInput = getByPlaceholderText(messages.courseNumberPlaceholder.defaultMessage);
    const runInput = getByPlaceholderText(messages.courseRunPlaceholder.defaultMessage);

    act(() => {
      fireEvent.change(displayNameInput, { target: { value: 'foo course name' } });
      fireEvent.change(orgInput, { target: { value: 'edx with space' } });
      fireEvent.change(numberInput, { target: { value: 'number with invalid (+) symbol' } });
      fireEvent.change(runInput, { target: { value: 'number with invalid (=) symbol' } });
    });

    waitFor(() => {
      expect(createBtn).toBeDisabled();
    });
  });
});

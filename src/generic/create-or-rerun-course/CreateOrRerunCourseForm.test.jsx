import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import {
  act,
  fireEvent, render,
  waitFor,
} from '@testing-library/react';
import { getConfig, initializeMockApp } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { AppProvider } from '@edx/frontend-platform/react';

import initializeStore from '../../store';
import messages from './messages';
import { CreateOrRerunCourseForm } from '.';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: () => ({
    courseId: 'course-id-mock',
  }),
}));

let axiosMock;
let store;

const onClickCancelMock = jest.fn();
const onClickCreateMock = jest.fn();

const RootWrapper = (props) => (
  <IntlProvider locale="en">
    <AppProvider store={store}>
      <CreateOrRerunCourseForm {...props} />
    </AppProvider>
  </IntlProvider>
);

const props = {
  title: 'Mocked title',
  isCreateNewCourse: true,
  initialValues: {
    displayName: '',
    org: '',
    number: '',
    run: '',
  },
  onClickCreate: onClickCreateMock,
  onClickCancel: onClickCancelMock,
};

describe('<CreateOrRerunCourseForm />', () => {
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
      .reply(200, ['edX', 'org']);
  });

  it('renders form successfully', () => {
    const { getByText, getByPlaceholderText } = render(
      <RootWrapper {...props} />,
    );
    expect(getByText(props.title)).toBeInTheDocument();
    expect(getByText(messages.courseDisplayNameLabel.defaultMessage)).toBeInTheDocument();
    expect(getByPlaceholderText(messages.courseDisplayNamePlaceholder.defaultMessage)).toBeInTheDocument();

    expect(getByText(messages.courseOrgLabel.defaultMessage)).toBeInTheDocument();
    expect(getByPlaceholderText(messages.courseOrgPlaceholder.defaultMessage)).toBeInTheDocument();

    expect(getByText(messages.courseNumberLabel.defaultMessage)).toBeInTheDocument();
    expect(getByPlaceholderText(messages.courseNumberPlaceholder.defaultMessage)).toBeInTheDocument();

    expect(getByText(messages.courseRunLabel.defaultMessage)).toBeInTheDocument();
    expect(getByPlaceholderText(messages.courseRunPlaceholder.defaultMessage)).toBeInTheDocument();
  });

  it('should call handleOnClickCancel if button cancel clicked', async () => {
    const { getByRole } = render(<RootWrapper {...props} />);
    const cancelBtn = getByRole('button', { name: messages.cancelButton.defaultMessage });
    act(() => {
      fireEvent.click(cancelBtn);
    });
    expect(onClickCancelMock).toHaveBeenCalled();
  });

  it('should call handleOnClickCreate if button create clicked', async () => {
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
    waitFor(() => {
      expect(onClickCreateMock).toHaveBeenCalled();
    });
  });

  it('should be disabled create button if form not filled', () => {
    const { getByRole } = render(<RootWrapper {...props} />);
    const createBtn = getByRole('button', { name: messages.createButton.defaultMessage });
    expect(createBtn).toBeDisabled();
  });

  it('should be disabled rerun button if form not filled', () => {
    const initialProps = { ...props, isCreateNewCourse: false };
    const { getByRole } = render(<RootWrapper {...initialProps} />);
    const rerunBtn = getByRole('button', { name: messages.rerunCreateButton.defaultMessage });
    expect(rerunBtn).toBeDisabled();
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

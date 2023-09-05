import React from 'react';
import { useSelector } from 'react-redux';
import {
  act,
  fireEvent,
  render,
  waitFor,
} from '@testing-library/react';
import { initializeMockApp } from '@edx/frontend-platform';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { AppProvider } from '@edx/frontend-platform/react';

import { studioHomeMock } from '../../studio-home/__mocks__';
import initializeStore from '../../store';
import messages from './messages';
import { CreateOrRerunCourseForm } from '.';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: () => ({
    courseId: 'course-id-mock',
  }),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

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
    useSelector.mockReturnValue(studioHomeMock);
  });

  it('renders form successfully', () => {
    const { getByText, getByPlaceholderText } = render(
      <RootWrapper {...props} />,
    );
    expect(getByText(props.title)).toBeInTheDocument();
    expect(getByText(messages.courseDisplayNameLabel.defaultMessage)).toBeInTheDocument();
    expect(getByPlaceholderText(messages.courseDisplayNamePlaceholder.defaultMessage)).toBeInTheDocument();

    expect(getByText(messages.courseOrgLabel.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.courseOrgNoOptions.defaultMessage)).toBeInTheDocument();

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
    const { getByPlaceholderText, getByText } = render(<RootWrapper {...props} />);
    const displayNameInput = getByPlaceholderText(messages.courseDisplayNamePlaceholder.defaultMessage);
    const orgInput = getByText(messages.courseOrgNoOptions.defaultMessage);
    const numberInput = getByPlaceholderText(messages.courseNumberPlaceholder.defaultMessage);
    const runInput = getByPlaceholderText(messages.courseRunPlaceholder.defaultMessage);
    act(() => {
      fireEvent.change(displayNameInput, { target: { value: 'foo course name' } });
      fireEvent.click(orgInput);
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
    const { getByRole, getByPlaceholderText, getByText } = render(<RootWrapper {...props} />);
    const createBtn = getByRole('button', { name: messages.createButton.defaultMessage });
    const displayNameInput = getByPlaceholderText(messages.courseDisplayNamePlaceholder.defaultMessage);
    const orgInput = getByText(messages.courseOrgNoOptions.defaultMessage);
    const numberInput = getByPlaceholderText(messages.courseNumberPlaceholder.defaultMessage);
    const runInput = getByPlaceholderText(messages.courseRunPlaceholder.defaultMessage);

    act(() => {
      fireEvent.change(displayNameInput, { target: { value: 'foo course name' } });
      fireEvent.click(orgInput);
      fireEvent.change(numberInput, { target: { value: 'number with invalid (+) symbol' } });
      fireEvent.change(runInput, { target: { value: 'number with invalid (=) symbol' } });
    });

    waitFor(() => {
      expect(createBtn).toBeDisabled();
    });
  });
});

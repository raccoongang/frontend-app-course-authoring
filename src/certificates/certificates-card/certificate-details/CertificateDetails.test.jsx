import { Provider, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { initializeMockApp } from '@edx/frontend-platform';

import initializeStore from '../../../store';
import { MODE_STATES } from '../../data/constants';
import { setMode } from '../../data/slice';
import { deleteCourseCertificate } from '../../data/thunks';
import messages from '../messages';
import CertificateDetails from './CertificateDetails';

let store;
const courseId = 'course-v1:edX+DemoX+Demo_Course';
const certificateId = 123;

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

jest.mock('@edx/frontend-platform/i18n', () => ({
  ...jest.requireActual('@edx/frontend-platform/i18n'),
  useIntl: () => ({
    formatMessage: (message) => message.defaultMessage,
  }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

jest.mock('../../data/slice', () => ({
  setMode: jest.fn(),
}));

jest.mock('../../data/thunks', () => ({
  deleteCourseCertificate: jest.fn(),
}));

const renderComponent = (props) => render(
  <Provider store={store}>
    <IntlProvider locale="en">
      <CertificateDetails {...props} />
    </IntlProvider>
  </Provider>,
);

const defaultProps = {
  componentMode: MODE_STATES.view,
  detailsCourseTitle: 'Course Title',
  detailsCourseNumber: 'Course Number',
  handleChange: jest.fn(),
  handleBlur: jest.fn(),
};

const initialState = {
  certificates: {
    certificatesData: {
      certificates: [],
      hasCertificateModes: false,
    },
  },
};

describe('CertificateDetails', () => {
  let mockDispatch;

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
    useParams.mockReturnValue({ courseId });
    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    useParams.mockClear();
    mockDispatch.mockClear();
  });

  it('renders correctly in view mode', () => {
    const { getByText } = renderComponent(defaultProps);
    expect(getByText(messages.detailsSectionTitle.defaultMessage)).toBeInTheDocument();
    expect(getByText(defaultProps.detailsCourseTitle)).toBeInTheDocument();
  });
  it('handles edit button click', () => {
    const { getByLabelText } = renderComponent(defaultProps);
    const editButton = getByLabelText(messages.editTooltip.defaultMessage);
    fireEvent.click(editButton);

    expect(mockDispatch).toHaveBeenCalledWith(setMode(MODE_STATES.EDIT_ALL));
  });
  it('opens confirm modal on delete button click', () => {
    const { getByLabelText, getByText } = renderComponent(defaultProps);
    const deleteButton = getByLabelText(messages.deleteTooltip.defaultMessage);
    fireEvent.click(deleteButton);
    expect(getByText('Delete this certificate?')).toBeInTheDocument();
  });
  it('dispatches delete action on confirm modal action', async () => {
    const props = { ...defaultProps, courseId, certificateId };
    const { getByLabelText, getByText } = renderComponent(props);

    const deleteButton = getByLabelText(messages.deleteTooltip.defaultMessage);
    fireEvent.click(deleteButton);

    await waitFor(() => {
      const confirmActionButton = getByText(messages.deleteTooltip.defaultMessage);
      fireEvent.click(confirmActionButton);
    });

    expect(mockDispatch).toHaveBeenCalledWith(deleteCourseCertificate(courseId, certificateId));
  });

  it('renders correctly in create mode', () => {
    const props = { ...defaultProps, componentMode: MODE_STATES.create };
    const { getByText, getByPlaceholderText } = renderComponent(props);

    expect(getByText(messages.detailsSectionTitle.defaultMessage)).toBeInTheDocument();
    expect(getByPlaceholderText(messages.detailsCourseTitleOverride.defaultMessage)).toBeInTheDocument();
  });

  it('handles input change in create mode', async () => {
    const props = { ...defaultProps, componentMode: MODE_STATES.create };
    const { getByPlaceholderText } = renderComponent(props);
    const input = getByPlaceholderText(messages.detailsCourseTitleOverride.defaultMessage);
    const newInputValue = 'New Title';

    userEvent.type(input, newInputValue);

    waitFor(() => {
      expect(input.value).toBe(newInputValue);
    });
  });

  it('does not show delete button in create mode', () => {
    const props = { ...defaultProps, mode: MODE_STATES.CREATE };
    const { queryByLabelText } = renderComponent(props);
    expect(queryByLabelText(messages.deleteTooltip.defaultMessage)).not.toBeInTheDocument();
  });

  it('shows course title override in view mode', () => {
    const courseTitleOverride = 'Overridden Title';
    const props = { ...defaultProps, courseTitleOverride };
    const { getByText } = renderComponent(props);
    expect(getByText(courseTitleOverride)).toBeInTheDocument();
  });
});

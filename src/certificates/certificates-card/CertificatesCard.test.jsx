import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { initializeMockApp } from '@edx/frontend-platform';

import initializeStore from '../../store';
import { signatoriesMock } from '../__mocks__';
import { getComponentMode } from '../data/selectors';
import { MODE_STATES } from '../data/constants';
import { createCourseCertificate } from '../data/thunks';
import CertificatesCard from './CertificatesCard';
import messages from './messages';

let store;
const courseId = 'course-123';
const certificateId = 1;

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(() => jest.fn()),
}));

jest.mock('../data/thunks', () => ({
  createCourseCertificate: jest.fn(),
}));

const renderComponent = () => render(
  <Provider store={store}>
    <IntlProvider locale="en">
      <CertificatesCard
        id={certificateId}
        signatories={signatoriesMock}
        courseId={courseId}
      />
    </IntlProvider>
  </Provider>,
);

const initialState = {
  certificates: {
    certificatesData: {
      certificates: [],
      hasCertificateModes: true,
    },
    componentMode: MODE_STATES.create,
  },
};

describe('CertificatesCard', () => {
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

  it('renders CertificateDetails and CertificateSignatories in view mode', () => {
    const { getByText } = renderComponent();

    expect(getByText(messages.detailsSectionTitle.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.signatoriesSectionTitle.defaultMessage)).toBeInTheDocument();
  });

  it('renders form elements in create mode', () => {
    useSelector.mockImplementation(selector => {
      if (selector === getComponentMode) {
        return MODE_STATES.create;
      }
      return MODE_STATES.view;
    });
    const { getByText } = renderComponent();

    expect(getByText(messages.cardCreate.defaultMessage)).toBeInTheDocument();
  });

  it('submits form with correct data in create mode', async () => {
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);

    const { getByRole, getByLabelText } = renderComponent();

    userEvent.type(getByLabelText(messages.detailsCourseTitleOverride.defaultMessage), 'New Title');
    userEvent.click(getByRole('button', { name: messages.cardCreate.defaultMessage }));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        createCourseCertificate(courseId, {
          courseTitle: 'New Title',
          signatories: [
            {
              name: '',
              title: '',
              organization: '',
              signatureImagePath: '',
            },
          ],
        }),
      );
    });
  });
});

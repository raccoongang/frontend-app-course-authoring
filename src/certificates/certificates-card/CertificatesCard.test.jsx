import {
  render, fireEvent, waitFor, act,
} from '@testing-library/react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { initializeMockApp } from '@edx/frontend-platform';

import initializeStore from '../../store';
import { getMode } from '../data/selectors';
import { MODE_STATES } from '../data/constants';
import { createCourseCertificate } from '../data/thunks';
import CertificatesCard from './CertificatesCard';
import messages from './messages';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(() => jest.fn()),
}));

jest.mock('../data/thunks', () => ({
  createCourseCertificate: jest.fn(),
}));

let store;
const courseId = 'course-123';
const certificateId = 1;
const signatories = [{
  name: 'John Doe', title: 'CEO', organization: 'Company', signatureImagePath: '',
}];

const initialState = {
  certificates: {
    certificatesData: {
      certificates: [],
      hasCertificateModes: true,
    },
    mode: MODE_STATES.CREATE,
  },
};

const renderComponent = () => render(
  <Provider store={store}>
    <IntlProvider locale="en">
      <CertificatesCard
        id={certificateId}
        signatories={signatories}
        courseId={courseId}
      />
    </IntlProvider>
  </Provider>,
);

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
      if (selector === getMode) {
        return MODE_STATES.CREATE;
      }
      return MODE_STATES.VIEW;
    });
    const { getByText } = renderComponent();
    expect(getByText(messages.cardCreate.defaultMessage)).toBeInTheDocument();
  });

  it('submits form with correct data in create mode', async () => {
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);

    const { getByText, getByLabelText } = renderComponent();

    await act(async () => {
      fireEvent.change(getByLabelText(messages.detailsCourseTitleOverride.defaultMessage), { target: { value: 'New Title' } });
      fireEvent.click(getByText(messages.cardCreate.defaultMessage));
    });

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

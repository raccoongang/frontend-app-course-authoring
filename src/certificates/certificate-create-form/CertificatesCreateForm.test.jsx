import { render } from '@testing-library/react';
import { Provider, useSelector } from 'react-redux';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { initializeMockApp } from '@edx/frontend-platform';

import initializeStore from '../../store';
import { MODE_STATES } from '../data/constants';
import { getComponentMode } from '../data/selectors';
import detailsMessages from '../certificate-details/messages';
import signatoryMessages from '../certificate-signatories/messages';
import CertificateCreateForm from './CertificateCreateForm';

const courseId = 'course-123';
let store;

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

const renderComponent = () => render(
  <Provider store={store}>
    <IntlProvider locale="en">
      <CertificateCreateForm courseId={courseId} />
    </IntlProvider>
  </Provider>,
);

const initialState = {
  certificates: {
    certificatesData: {
      certificates: [],
      hasCertificateModes: true,
    },
    mode: MODE_STATES.create,
  },
};

describe('CertificateCreateForm', () => {
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
    useSelector.mockImplementation((selector) => {
      if (selector === getComponentMode) {
        return MODE_STATES.create;
      }
      return jest.requireActual('react-redux').useSelector(selector);
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders with empty fields', () => {
    const { getByPlaceholderText } = renderComponent();

    expect(getByPlaceholderText(detailsMessages.detailsCourseTitleOverride.defaultMessage).value).toBe('');
    expect(getByPlaceholderText(signatoryMessages.namePlaceholder.defaultMessage).value).toBe('');
    expect(getByPlaceholderText(signatoryMessages.titlePlaceholder.defaultMessage).value).toBe('');
    expect(getByPlaceholderText(signatoryMessages.organizationPlaceholder.defaultMessage).value).toBe('');
    expect(getByPlaceholderText(signatoryMessages.imagePlaceholder.defaultMessage).value).toBe('');
  });
});

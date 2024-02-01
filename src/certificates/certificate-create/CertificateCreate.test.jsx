import { render } from '@testing-library/react';
import { Provider, useSelector } from 'react-redux';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { initializeMockApp } from '@edx/frontend-platform';

import initializeStore from '../../store';
import { MODE_STATES } from '../data/constants';
import { getComponentMode } from '../data/selectors';
import messages from '../certificates-card/messages';
import CertificateCreate from './CertificateCreate';

const courseId = 'course-123';
let store;

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

const renderComponent = () => render(
  <Provider store={store}>
    <IntlProvider locale="en">
      <CertificateCreate courseId={courseId} />
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

describe('CertificateCreate', () => {
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

    expect(getByPlaceholderText(messages.detailsCourseTitleOverride.defaultMessage).value).toBe('');
    expect(getByPlaceholderText(messages.namePlaceholder.defaultMessage).value).toBe('');
    expect(getByPlaceholderText(messages.titlePlaceholder.defaultMessage).value).toBe('');
    expect(getByPlaceholderText(messages.organizationPlaceholder.defaultMessage).value).toBe('');
    expect(getByPlaceholderText(messages.imagePlaceholder.defaultMessage).value).toBe('');
  });
});

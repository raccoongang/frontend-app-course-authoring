import { shallow } from '@edx/react-unit-test-utils';
import { render } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import * as hooks from '../hooks';
import messages from '../messages';
import XBlockContent from './XBlockContent';

jest.mock('../hooks', () => ({
  useIFrameBehavior: jest.fn(),
}));

const iframeBehavior = {
  handleIFrameLoad: jest.fn().mockName('IFrameBehavior.handleIFrameLoad'),
  hasLoaded: false,
  iframeHeight: 20,
  showError: false,
};

hooks.useIFrameBehavior.mockReturnValue(iframeBehavior);

const props = {
  iframeUrl: 'test-iframe-url',
  loadingMessage: 'test-loading-message',
  id: 'test-id',
  elementId: 'test-element-id',
  onLoaded: jest.fn().mockName('props.onLoaded'),
  title: 'test-title',
};

const RootComponent = () => (
  <IntlProvider locale="en">
    <XBlockContent {...props} />
  </IntlProvider>
);

let el;
describe('XBlockContent Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('initializes iframe behavior hook', () => {
    const { getByTestId } = render(<RootComponent />);
    expect(getByTestId('content-iframe-test-id')).toBeInTheDocument();
    expect(hooks.useIFrameBehavior).toHaveBeenCalledWith({
      elementId: props.elementId,
      id: props.id,
      iframeUrl: props.iframeUrl,
      onLoaded: props.onLoaded,
    });
  });
  it('displays errorPage if showError', () => {
    hooks.useIFrameBehavior.mockReturnValueOnce({ ...iframeBehavior, hasLoaded: false, showError: true });
    const { getByText } = render(<RootComponent />);
    expect(getByText(messages.iframeErrorText.defaultMessage)).toBeInTheDocument();
  });
  it('displays LoadingSpinner component if not showError', () => {
    hooks.useIFrameBehavior.mockReturnValueOnce({ ...iframeBehavior, hasLoaded: false, showError: false });
    const { getByText } = render(<RootComponent />);
    expect(getByText(/Loading.../i)).toBeInTheDocument();
  });
  it('does not display LoadingSpinner or ErrorPage', () => {
    hooks.useIFrameBehavior.mockReturnValueOnce({ ...iframeBehavior, hasLoaded: true });
    const { queryByText } = render(<RootComponent />);
    expect(queryByText(/Loading.../i)).not.toBeInTheDocument();
    expect(queryByText(messages.iframeErrorText.defaultMessage)).not.toBeInTheDocument();
  });
  it('display iframe with props from hooks 222', () => {
    el = shallow(<RootComponent />);
    const component = el.instance.el.children[0];
    expect(JSON.stringify(component.props)).toBe(JSON.stringify({
      iframeUrl: props.iframeUrl,
      loadingMessage: props.loadingMessage,
      id: props.id,
      elementId: props.elementId,
      onLoaded: iframeBehavior.handleIFrameLoad,
      title: props.title,
    }));
  });
});

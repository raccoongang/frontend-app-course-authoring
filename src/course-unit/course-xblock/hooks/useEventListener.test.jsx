import { render, screen, waitFor } from '@testing-library/react';
import useEventListener from './useEventListener';

describe('useEventListener hook', () => {
  test('manages event listener', async () => {
    const handler = jest.fn();
    const TestComponent = () => {
      useEventListener('message', handler);
      return (<div data-testid="testid" />);
    };
    render(<TestComponent />);

    await screen.findByTestId('testid');
    window.postMessage({ test: 'test' }, '*');
    await waitFor(() => expect(handler).toHaveBeenCalled());
  });
});

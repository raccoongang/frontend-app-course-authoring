import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { initializeMockApp } from '@edx/frontend-platform';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import initializeStore from '../../../store';
import { clipboardUnit, clipboardXBlock } from '../../../__mocks__';
import useCopyToClipboard from './useCopyToClipboard';

let store;

const clipboardBroadcastChannelMock = {
  postMessage: jest.fn(),
  close: jest.fn(),
};

global.BroadcastChannel = jest.fn(() => clipboardBroadcastChannelMock);

const wrapper = ({ children }) => (
  <Provider store={store}>
    <IntlProvider locale="en">
      {children}
    </IntlProvider>
  </Provider>
);

describe('useCopyToClipboard', () => {
  beforeEach(async () => {
    initializeMockApp({
      authenticatedUser: {
        userId: 3,
        username: 'abc123',
        administrator: true,
        roles: [],
      },
    });

    store = initializeStore();
  });

  it('initializes correctly', () => {
    const { result } = renderHook(() => useCopyToClipboard(clipboardUnit, true), { wrapper });

    expect(result.current.showPasteUnit).toBe(true);
    expect(result.current.showPasteXBlock).toBe(false);
  });

  it('should update state and broadcast channel on clipboardData change', () => {
    const { result, rerender } = renderHook(({ clipboardData }) => useCopyToClipboard(clipboardData, true), {
      initialProps: { clipboardData: clipboardUnit },
    });

    expect(result.current.showPasteUnit).toBe(true);
    expect(result.current.showPasteXBlock).toBe(false);
    expect(result.current.sharedClipboardData).toEqual(clipboardUnit);

    rerender({ clipboardData: clipboardXBlock });

    expect(result.current.showPasteUnit).toBe(false);
    expect(result.current.showPasteXBlock).toBe(true);
    expect(result.current.sharedClipboardData).toEqual(clipboardXBlock);
  });

  it('should update state and broadcast channel when canEdit is false', () => {
    const { result } = renderHook(({ clipboardData }) => useCopyToClipboard(clipboardData, false), {
      initialProps: { clipboardData: clipboardUnit },
    });

    expect(result.current.showPasteUnit).toBe(false);
    expect(result.current.showPasteXBlock).toBe(false);
    expect(result.current.sharedClipboardData).toEqual({});
  });

  it('updates states correctly on receiving a broadcast message', async () => {
    const { result } = renderHook(({ clipboardData }) => useCopyToClipboard(clipboardData, true), {
      initialProps: { clipboardData: clipboardUnit },
    });

    clipboardBroadcastChannelMock.onmessage({ data: clipboardUnit });

    expect(result.current.showPasteUnit).toBe(true);
    expect(result.current.showPasteXBlock).toBe(false);

    clipboardBroadcastChannelMock.onmessage({ data: clipboardXBlock });

    expect(result.current.showPasteUnit).toBe(false);
    expect(result.current.showPasteXBlock).toBe(true);
  });
});

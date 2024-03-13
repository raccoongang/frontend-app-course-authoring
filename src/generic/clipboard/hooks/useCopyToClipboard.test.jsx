import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { initializeMockApp } from '@edx/frontend-platform';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { act } from 'react-dom/test-utils';

import initializeStore from '../../../store';
import useCopyToClipboard from './useCopyToClipboard';

const clipboardUnit = {
  content: {
    id: 67,
    userId: 3,
    created: '2024-01-16T13:09:11.540615Z',
    purpose: 'clipboard',
    status: 'ready',
    blockType: 'vertical',
    blockTypeDisplay: 'Unit',
    olxUrl: 'http://localhost:18010/api/content-staging/v1/staged-content/67/olx',
    displayName: 'Introduction: Video and Sequences',
  },
  sourceUsageKey: 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@vertical_0270f6de40fc',
  sourceContextTitle: 'Demonstration Course',
  sourceEditUrl: 'http://localhost:18010/container/block-v1:edX+DemoX+Demo_Course+type@vertical+block@vertical_0270f6de40fc',
};

const clipboardXBlock = {
  content: {
    id: 69,
    userId: 3,
    created: '2024-01-16T13:33:21.314439Z',
    purpose: 'clipboard',
    status: 'ready',
    blockType: 'html',
    blockTypeDisplay: 'Text',
    olxUrl: 'http://localhost:18010/api/content-staging/v1/staged-content/69/olx',
    displayName: 'Blank HTML Page',
  },
  sourceUsageKey: 'block-v1:edX+DemoX+Demo_Course+type@html+block@html1',
  sourceContextTitle: 'Demonstration Course',
  sourceEditUrl: 'http://localhost:18010/container/block-v1:edX+DemoX+Demo_Course+type@vertical+block@vertical1',
};

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

    act(() => {
      rerender({ clipboardData: clipboardXBlock });
    });

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

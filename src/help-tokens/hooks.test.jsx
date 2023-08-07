import { useDispatch, useSelector } from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';
import { useHelpTokens } from './hooks';
import { RequestStatus } from '../data/constants';
import { fetchHelpTokens } from './data/thunks';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('./data/thunks', () => ({
  fetchHelpTokens: jest.fn(),
}));

jest.mock('./data/selectors', () => ({
  getLoadingHelpTokensStatus: jest.fn(),
  selectHelpUrlsByNames: jest.fn(),
}));

describe('useHelpTokens', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches help tokens when loading status is pending', () => {
    useSelector.mockReturnValue(RequestStatus.PENDING);
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);

    renderHook(() => useHelpTokens(['token1', 'token2']));

    expect(mockDispatch).toHaveBeenCalledWith(fetchHelpTokens());
  });

  it('returns help tokens from the selector', () => {
    const mockHelpTokens = ['url1', 'url2'];
    useSelector.mockReturnValue(mockHelpTokens);

    const { result } = renderHook(() => useHelpTokens(['token1', 'token2']));

    expect(result.current).toEqual(mockHelpTokens);
  });
});

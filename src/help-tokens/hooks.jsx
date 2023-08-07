import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHelpTokens } from './data/thunks';
import { getLoadingHelpTokensStatus, selectHelpUrlsByNames } from './data/selectors';
import { RequestStatus } from '../data/constants';

const useHelpTokens = (tokenNames) => {
  const dispatch = useDispatch();
  const helpTokens = useSelector(selectHelpUrlsByNames(tokenNames));
  const loadingHelpTokenStatus = useSelector(getLoadingHelpTokensStatus);

  useEffect(() => {
    if (loadingHelpTokenStatus === RequestStatus.PENDING) {
      dispatch(fetchHelpTokens());
    }
  }, []);

  return helpTokens;
};
/* eslint-disable-next-line import/prefer-default-export */
export { useHelpTokens };

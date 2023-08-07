import { getHelpTokens } from './api';
import { updateLoadingHelpTokensStatus, updateLocales, updatePages } from './slice';
import { RequestStatus } from '../../data/constants';

/* eslint-disable import/prefer-default-export */
export function fetchHelpTokens() {
  return async (dispatch) => {
    dispatch(updateLoadingHelpTokensStatus({ status: RequestStatus.IN_PROGRESS }));

    try {
      const { pages, locales } = await getHelpTokens();

      dispatch(updatePages(pages));
      dispatch(updateLocales(locales));

      dispatch(updateLoadingHelpTokensStatus({ status: RequestStatus.SUCCESSFUL }));
      return true;
    } catch (error) {
      dispatch(updateLoadingHelpTokensStatus({ status: RequestStatus.FAILED }));

      return false;
    }
  };
}

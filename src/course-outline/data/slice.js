/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { RequestStatus } from '../../data/constants';

const slice = createSlice({
  name: 'courseOutline',
  initialState: {
    loadingOutlineIndexStatus: RequestStatus.IN_PROGRESS,
    reindexLink: '',
    lmsLink: '',
    docsLinks: {
      learnMoreOutlineUrl: '',
      learnMoreGradingUrl: '',
      learnMoreVisibilityUrl: '',
    },
  },
  reducers: {
    fetchOutlineIndexSuccess: (state, { payload }) => {
      state.reindexLink = payload.reindexLink;
      state.lmsLink = payload.lmsLink;
      state.docsLinks = {
        learnMoreOutlineUrl: payload.learnMoreOutlineUrl,
        learnMoreGradingUrl: payload.learnMoreGradingUrl,
        learnMoreVisibilityUrl: payload.learnMoreVisibilityUrl,
      };
    },
    updateLoadingOutlineIndexStatus: (state, { payload }) => {
      state.loadingOutlineIndexStatus = payload.status;
    },
  },
});

export const {
  fetchOutlineIndexSuccess,
  updateLoadingOutlineIndexStatus,
} = slice.actions;

export const {
  reducer,
} = slice;

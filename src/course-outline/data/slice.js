/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { RequestStatus } from '../../data/constants';

const slice = createSlice({
  name: 'courseOutline',
  initialState: {
    loadingOutlineIndexStatus: RequestStatus.IN_PROGRESS,
    reindexLink: '',
    lmsLink: '',
    courseReleaseDate: '',
    highlightsEnabledForMessaging: false,
    highlightsDocUrl: '',
    checklist: {
      totalCourseLaunchChecks: 0,
      completedCourseLaunchChecks: 0,
    },
    isSelfPaced: false,
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
      state.courseReleaseDate = payload.courseReleaseDate;
      state.highlightsEnabledForMessaging = payload.courseStructure.highlightsEnabledForMessaging;
      state.highlightsDocUrl = payload.courseStructure.highlightsDocUrl;
      state.docsLinks = {
        learnMoreOutlineUrl: payload.learnMoreOutlineUrl,
        learnMoreGradingUrl: payload.learnMoreGradingUrl,
        learnMoreVisibilityUrl: payload.learnMoreVisibilityUrl,
      };
    },
    updateLoadingOutlineIndexStatus: (state, { payload }) => {
      state.loadingOutlineIndexStatus = payload.status;
    },
    updateChecklist: (state, { payload }) => {
      console.log(payload, '---------- payload');
      state.checklist.totalCourseLaunchChecks = payload.totalCourseLaunchChecks;
      state.checklist.completedCourseLaunchChecks = payload.completedCourseLaunchChecks;
    },
  },
});

export const {
  fetchOutlineIndexSuccess,
  updateLoadingOutlineIndexStatus,
  updateChecklist,
} = slice.actions;

export const {
  reducer,
} = slice;

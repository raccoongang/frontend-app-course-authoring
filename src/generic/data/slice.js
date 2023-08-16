/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { RequestStatus } from '../../data/constants';

const slice = createSlice({
  name: 'generic',
  initialState: {
    loadingStatus: RequestStatus.IN_PROGRESS,
    savingStatus: '',
    organizations: [],
    createOrRerunCourse: {
      courseData: {},
      courseRerunData: {},
      redirectUrlObj: {},
      postErrors: {},
    },
  },
  reducers: {
    fetchOrganizations: (state, { payload }) => {
      state.organizations = payload;
    },
    updateLoadingStatus: (state, { payload }) => {
      state.loadingStatus = payload.status;
    },
    updateSavingStatus: (state, { payload }) => {
      state.savingStatus = payload.status;
    },
    updateCourseData: (state, { payload }) => {
      state.createOrRerunCourse.courseData = payload;
    },
    updateCourseRerunData: (state, { payload }) => {
      state.createOrRerunCourse.courseRerunData = payload;
    },
    updateRedirectUrlObj: (state, { payload }) => {
      state.createOrRerunCourse.redirectUrlObj = payload;
    },
    updatePostErrors: (state, { payload }) => {
      state.createOrRerunCourse.postErrors = payload;
    },
  },
});

export const {
  fetchOrganizations,
  updatePostErrors,
  updateCourseRerunData,
  updateLoadingStatus,
  updateSavingStatus,
  updateCourseData,
  updateRedirectUrlObj,
} = slice.actions;

export const {
  reducer,
} = slice;

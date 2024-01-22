/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { RequestStatus } from '../../data/constants';

const slice = createSlice({
  name: 'courseUnit',
  initialState: {
    savingStatus: '',
    isQueryPending: false,
    isEditTitleFormOpen: false,
    loadingStatus: {
      fetchUnitLoadingStatus: RequestStatus.IN_PROGRESS,
      courseSectionVerticalLoadingStatus: RequestStatus.IN_PROGRESS,
      courseVerticalChildrenLoadingStatus: RequestStatus.IN_PROGRESS,
    },
    unit: {},
    courseSectionVertical: {},
    courseVerticalChildren: [],
  },
  reducers: {
    fetchCourseItemSuccess: (state, { payload }) => {
      state.unit = payload;
    },
    updateLoadingCourseUnitStatus: (state, { payload }) => {
      state.loadingStatus = {
        ...state.loadingStatus,
        fetchUnitLoadingStatus: payload.status,
      };
    },
    updateQueryPendingStatus: (state, { payload }) => {
      state.isQueryPending = payload;
    },
    changeEditTitleFormOpen: (state, { payload }) => {
      state.isEditTitleFormOpen = payload;
    },
    updateSavingStatus: (state, { payload }) => {
      state.savingStatus = payload.status;
    },
    fetchSequenceRequest: (state, { payload }) => {
      state.sequenceId = payload.sequenceId;
      state.sequenceStatus = RequestStatus.IN_PROGRESS;
      state.sequenceMightBeUnit = false;
    },
    fetchSequenceSuccess: (state, { payload }) => {
      state.sequenceId = payload.sequenceId;
      state.sequenceStatus = RequestStatus.SUCCESSFUL;
      state.sequenceMightBeUnit = false;
    },
    fetchSequenceFailure: (state, { payload }) => {
      state.sequenceId = payload.sequenceId;
      state.sequenceStatus = RequestStatus.FAILED;
      state.sequenceMightBeUnit = payload.sequenceMightBeUnit || false;
    },
    fetchCourseRequest: (state, { payload }) => {
      state.courseId = payload.courseId;
      state.courseStatus = RequestStatus.IN_PROGRESS;
    },
    fetchCourseSuccess: (state, { payload }) => {
      state.courseId = payload.courseId;
      state.courseStatus = RequestStatus.SUCCESSFUL;
    },
    fetchCourseFailure: (state, { payload }) => {
      state.courseId = payload.courseId;
      state.courseStatus = RequestStatus.FAILED;
    },
    fetchCourseDenied: (state, { payload }) => {
      state.courseId = payload.courseId;
      state.courseStatus = RequestStatus.DENIED;
    },
    fetchCourseSectionVerticalDataSuccess: (state, { payload }) => {
      state.courseSectionVertical = payload;
    },
    updateLoadingCourseSectionVerticalDataStatus: (state, { payload }) => {
      state.loadingStatus = {
        ...state.loadingStatus,
        courseSectionVerticalLoadingStatus: payload.status,
      };
    },
    updateLoadingCourseXblockStatus: (state, { payload }) => {
      state.loadingStatus = {
        ...state.loadingStatus,
        createUnitXblockLoadingStatus: payload.status,
      };
    },
    addNewUnitStatus: (state, { payload }) => {
      state.loadingStatus = {
        ...state.loadingStatus,
        fetchUnitLoadingStatus: payload.status,
      };
    },
    updateCourseVerticalChildren: (state, { payload }) => {
      state.courseVerticalChildren = payload;
    },
    updateCourseVerticalChildrenLoadingStatus: (state, { payload }) => {
      state.loadingStatus = {
        ...state.loadingStatus,
        courseVerticalChildrenLoadingStatus: payload.status,
      };
    },
  },
});

export const {
  fetchCourseItemSuccess,
  updateLoadingCourseUnitStatus,
  updateSavingStatus,
  updateModel,
  fetchSequenceRequest,
  fetchSequenceSuccess,
  fetchSequenceFailure,
  fetchCourseRequest,
  fetchCourseSuccess,
  fetchCourseFailure,
  fetchCourseDenied,
  fetchCourseSectionVerticalDataSuccess,
  updateLoadingCourseSectionVerticalDataStatus,
  changeEditTitleFormOpen,
  updateQueryPendingStatus,
  updateLoadingCourseXblockStatus,
  updateCourseVerticalChildren,
  updateCourseVerticalChildrenLoadingStatus,
} = slice.actions;

export const {
  reducer,
} = slice;

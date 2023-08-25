/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { RequestStatus } from '../../data/constants';

const slice = createSlice({
  name: 'courseOutline',
  initialState: {
    loadingStatus: {
      outlineIndexLoadingStatus: RequestStatus.IN_PROGRESS,
      reIndexLoadingStatus: RequestStatus.IN_PROGRESS,
      fetchSectionLoadingStatus: RequestStatus.IN_PROGRESS,
    },
    outlineIndexData: {},
    savingStatus: '',
    savingProcess: '',
    statusBarData: {
      courseReleaseDate: '',
      highlightsEnabledForMessaging: false,
      isSelfPaced: false,
      checklist: {
        totalCourseLaunchChecks: 0,
        completedCourseLaunchChecks: 0,
        totalCourseBestPracticesChecks: 0,
        completedCourseBestPracticesChecks: 0,
      },
    },
    sectionsList: [],
    currentSection: {},
  },
  reducers: {
    fetchOutlineIndexSuccess: (state, { payload }) => {
      state.outlineIndexData = payload;
      state.sectionsList = payload.courseStructure?.childInfo?.children || [];
    },
    updateOutlineIndexLoadingStatus: (state, { payload }) => {
      state.loadingStatus = {
        ...state.loadingStatus,
        outlineIndexLoadingStatus: payload.status,
      };
    },
    updateReindexLoadingStatus: (state, { payload }) => {
      state.loadingStatus = {
        ...state.loadingStatus,
        reIndexLoadingStatus: payload.status,
      };
    },
    updateFetchSectionLoadingStatus: (state, { payload }) => {
      state.loadingStatus = {
        ...state.loadingStatus,
        fetchSectionLoadingStatus: payload.status,
      };
    },
    updateStatusBar: (state, { payload }) => {
      state.statusBarData = {
        ...state.statusBarData,
        ...payload,
      };
    },
    fetchStatusBarChecklistSuccess: (state, { payload }) => {
      state.statusBarData.checklist = {
        ...state.statusBarData.checklist,
        ...payload,
      };
    },
    fetchStatusBarSelPacedSuccess: (state, { payload }) => {
      state.statusBarData.isSelfPaced = payload.isSelfPaced;
    },
    updateSavingStatus: (state, { payload }) => {
      state.savingStatus = payload.status;
    },
    updateSavingProcess: (state, { payload }) => {
      state.savingProcess = payload;
    },
    updateSectionList: (state, { payload }) => {
      state.sectionsList = state.sectionsList.map((section) => (section.id === payload.id ? payload : section));
    },
    setCurrentSection: (state, { payload }) => {
      state.currentSection = payload;
    },
    deleteSection: (state, { payload }) => {
      state.sectionsList = state.sectionsList.filter(({ id }) => id !== payload);
    },
    duplicateSection: (state, { payload }) => {
      const duplicatedElement = state.sectionsList.filter(({ id }) => id === payload.id);
      const duplicateIndex = state.sectionsList.indexOf(duplicatedElement);

      state.sectionsList = state.sectionsList.splice(duplicateIndex + 1, 0, payload.duplicatedSection);
    },
  },
});

export const {
  fetchOutlineIndexSuccess,
  updateOutlineIndexLoadingStatus,
  updateReindexLoadingStatus,
  updateStatusBar,
  fetchStatusBarChecklistSuccess,
  fetchStatusBarSelPacedSuccess,
  updateFetchSectionLoadingStatus,
  updateSavingStatus,
  updateSectionList,
  setCurrentSection,
  deleteSection,
  updateSavingProcess,
  duplicateSection,
} = slice.actions;

export const {
  reducer,
} = slice;

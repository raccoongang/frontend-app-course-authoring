/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { RequestStatus } from '../../data/constants';

const slice = createSlice({
  name: 'courseUnit',
  initialState: {
    savingStatus: '',
    errorMessage: '',
    csrfToken: '',
    isQueryPending: false,
    isTitleEditFormOpen: false,
    movedXBlockParams: {
      isSuccess: false,
      isUndo: false,
      title: '',
      sourceLocator: '',
      targetParentLocator: '',
    },
    loadingStatus: {
      fetchUnitLoadingStatus: RequestStatus.IN_PROGRESS,
      courseSectionVerticalLoadingStatus: RequestStatus.IN_PROGRESS,
      courseVerticalChildrenLoadingStatus: RequestStatus.IN_PROGRESS,
    },
    unit: {},
    courseSectionVertical: {},
    courseVerticalChildren: { children: [], isPublished: true },
    staticFileNotices: {},
    xblockIFrameHtmlAndResources: [],
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
    updateMovedXBlockParams: (state, { payload }) => {
      state.movedXBlockParams = { ...state.movedXBlockParams, ...payload };
    },
    changeEditTitleFormOpen: (state, { payload }) => {
      state.isTitleEditFormOpen = payload;
    },
    updateSavingStatus: (state, { payload }) => {
      const { status, errorMessage } = payload;
      state.savingStatus = status;
      state.errorMessage = errorMessage;
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
    fetchCourseSectionVerticalDataSuccess: (state, { payload }) => {
      state.courseSectionVertical = payload;
    },
    updateLoadingCourseSectionVerticalDataStatus: (state, { payload }) => {
      state.loadingStatus = {
        ...state.loadingStatus,
        courseSectionVerticalLoadingStatus: payload.status,
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
      state.loadingStatus.courseVerticalChildrenLoadingStatus = payload.status;
    },
    deleteXBlock: (state, { payload }) => {
      state.courseVerticalChildren.children = state.courseVerticalChildren.children.filter(
        (component) => component.id !== payload,
      );
    },
    duplicateXBlock: (state, { payload }) => {
      state.courseVerticalChildren = {
        ...payload.newCourseVerticalChildren,
        children: payload.newCourseVerticalChildren.children.map((component) => {
          if (component.blockId === payload.newId) {
            component.shouldScroll = true;
          }
          return component;
        }),
      };
    },
    fetchStaticFileNoticesSuccess: (state, { payload }) => {
      state.staticFileNotices = payload;
    },
    reorderXBlockList: (state, { payload }) => {
      // Create a map for payload IDs to their index for O(1) lookups
      const indexMap = new Map(payload.map((id, index) => [id, index]));

      // Directly sort the children based on the order defined in payload
      // This avoids the need to copy the array beforehand
      state.courseVerticalChildren.children.sort((a, b) => (indexMap.get(a.id) || 0) - (indexMap.get(b.id) || 0));
    },
    fetchXBlockIFrameResources: (state, { payload }) => {
      const xblockIdx = state.xblockIFrameHtmlAndResources.findIndex(item => item.xblockId === payload.xblockId);
      if (xblockIdx !== -1) {
        state.xblockIFrameHtmlAndResources[xblockIdx] = payload;
      } else {
        state.xblockIFrameHtmlAndResources.push(payload);
      }
    },
    fetchCsrfTokenSuccess: (state, { payload }) => {
      state.csrfToken = payload;
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
  fetchCourseSectionVerticalDataSuccess,
  updateLoadingCourseSectionVerticalDataStatus,
  changeEditTitleFormOpen,
  updateQueryPendingStatus,
  updateCourseVerticalChildren,
  updateCourseVerticalChildrenLoadingStatus,
  deleteXBlock,
  duplicateXBlock,
  fetchStaticFileNoticesSuccess,
  reorderXBlockList,
  fetchXBlockIFrameResources,
  fetchCsrfTokenSuccess,
  updateMovedXBlockParams,
} = slice.actions;

export const {
  reducer,
} = slice;

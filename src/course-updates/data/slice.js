import { createSlice } from '@reduxjs/toolkit';

/* eslint no-param-reassign: "error" */
const slice = createSlice({
  name: 'courseUpdates',
  initialState: {
    courseUpdates: [],
    courseHandouts: {},
  },
  reducers: {
    fetchCourseUpdatesSuccess: (state, { payload }) => {
      state.courseUpdates = payload;
    },
    createCourseUpdates: (state, { payload }) => {
      state.courseUpdates = [payload, ...state.courseUpdates];
    },
    editCourseUpdates: (state, { payload }) => {
      state.courseUpdates = state.courseUpdates.map((courseUpdate) => {
        if (courseUpdate.id === payload.id) {
          return payload;
        }
        return courseUpdate;
      });
    },
    deleteCourseUpdates: (state, { payload }) => {
      state.courseUpdates = payload;
    },
    fetchCourseHandoutsSuccess: (state, { payload }) => {
      state.courseHandouts = payload;
    },
    editCourseHandout: (state, { payload }) => {
      state.courseHandouts = {
        ...state.courseHandouts,
        ...payload,
      };
    },
  },
});

export const {
  fetchCourseUpdatesSuccess,
  createCourseUpdates,
  editCourseUpdates,
  deleteCourseUpdates,
  fetchCourseHandoutsSuccess,
  editCourseHandout,
} = slice.actions;

export const {
  reducer,
} = slice;

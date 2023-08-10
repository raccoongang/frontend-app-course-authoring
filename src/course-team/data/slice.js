/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { RequestStatus } from '../../data/constants';

const slice = createSlice({
  name: 'courseTeam',
  initialState: {
    loadingCourseTeamStatus: RequestStatus.IN_PROGRESS,
    savingStatus: '',
    users: [],
    show_transfer_ownership_hint: false,
    allow_actions: false,
    errorMessage: '',
  },
  reducers: {
    fetchCourseTeamSuccess: (state, { payload }) => {
      state.users = payload.users;
      state.show_transfer_ownership_hint = payload.show_transfer_ownership_hint;
      state.allow_actions = payload.allow_actions;
    },
    updateLoadingCourseTeamStatus: (state, { payload }) => {
      state.loadingCourseTeamStatus = payload.status;
    },
    deleteCourseTeamUser: (state, { payload }) => {
      state.users = state.users.filter((user) => user.email !== payload);
    },
    updateSavingStatus: (state, { payload }) => {
      state.savingStatus = payload.status;
    },
    setErrorMessage: (state, { payload }) => {
      state.errorMessage = payload;
    },
  },
});

export const {
  fetchCourseTeamSuccess,
  updateLoadingCourseTeamStatus,
  deleteCourseTeamUser,
  updateSavingStatus,
  setErrorMessage,
} = slice.actions;

export const {
  reducer,
} = slice;

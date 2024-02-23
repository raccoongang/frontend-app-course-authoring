/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { RequestStatus } from '../../data/constants';

const slice = createSlice({
  name: 'groupConfigurations',
  initialState: {
    savingStatus: '',
    loadingStatus: RequestStatus.IN_PROGRESS,
    groupConfigurations: {},
  },
  reducers: {
    fetchGroupConfigurations: (state, { payload }) => {
      state.groupConfigurations = payload.groupConfigurations;
    },
    updateGroupConfigurationsSuccess: (state, { payload }) => {
      const groupIndex = state.groupConfigurations.allGroupConfigurations.findIndex(
        group => payload.data.id === group.id,
      );

      if (groupIndex !== -1) {
        state.groupConfigurations.allGroupConfigurations[groupIndex] = payload.data;
      }
    },
    deleteGroupConfigurationsSuccess: (state, { payload }) => {
      const { parentGroupId, groupId } = payload;
      const parentGroupIndex = state.groupConfigurations.allGroupConfigurations.findIndex(
        group => parentGroupId === group.id,
      );
      state.groupConfigurations.allGroupConfigurations[parentGroupIndex].groups = state
        .groupConfigurations.allGroupConfigurations[parentGroupIndex].groups.filter(group => group.id !== groupId);
    },
    updateLoadingStatus: (state, { payload }) => {
      state.loadingStatus = payload.status;
    },
    updateSavingStatuses: (state, { payload }) => {
      state.savingStatus = payload.status;
    },
  },
});

export const {
  fetchGroupConfigurations,
  updateLoadingStatus,
  updateSavingStatuses,
  updateGroupConfigurationsSuccess,
  deleteGroupConfigurationsSuccess,
} = slice.actions;

export const { reducer } = slice;
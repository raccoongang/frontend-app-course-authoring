/* eslint-disable import/prefer-default-export */

// export const getLoadingStatus = (state) => state.advancedSettings.loadingStatus;
export const getLoadingStatus = (state) => state.advancedSettings.loadingStatus;
export const getSavingStatus = (state) => state.advancedSettings.savingStatus;
export const getCourseAppsApiStatus = (state) => state.advancedSettings.courseAppsApiStatus;
export const getCourseAppSettingValue = (setting) => (state) => (
  state.advancedSettings.courseAppSettings[setting]?.value
);

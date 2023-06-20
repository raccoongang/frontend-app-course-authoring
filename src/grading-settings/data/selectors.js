export const getLoadingStatus = (state) => state.advancedSettings.loadingStatus;
export const getCourseAppSettings = state => state.gradingSettings.courseAppSettings;
export const getGradingSettings = state => state.gradingSettings.gradingSettings.courseDetails;
export const getSavingStatus = (state) => state.advancedSettings.savingStatus;
// export const getProctoringExamErrors = (state) => state.advancedSettings.proctoringErrors.proctoringErrors;
export const getSendRequestErrors = (state) => state.advancedSettings.sendRequestErrors.developer_message;

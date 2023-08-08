const getLoadingStatus = (state) => state.gradingSettings.loadingStatus;
const getGradingSettings = (state) => state.gradingSettings.gradingSettings.courseDetails;
const getProctoringExamSettingsUrl = (state) => state.gradingSettings.gradingSettings.mfeProctoredExamSettingsUrl;
const getCourseAssignmentLists = (state) => state.gradingSettings.gradingSettings.courseAssignmentLists;
const getSavingStatus = (state) => state.gradingSettings.savingStatus;
const getCourseSettings = (state) => state.gradingSettings.courseSettings;

export {
  getLoadingStatus,
  getGradingSettings,
  getProctoringExamSettingsUrl,
  getCourseAssignmentLists,
  getSavingStatus,
  getCourseSettings,
};

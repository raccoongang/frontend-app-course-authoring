export const getCourseUnitData = (state) => state.courseUnit.unit;
export const getCourseUnit = (state) => state.courseUnit;
export const getSavingStatus = (state) => state.courseUnit.savingStatus;
export const getLoadingStatus = (state) => state.courseUnit.loadingStatus;
export const getSequenceStatus = (state) => state.courseUnit.sequenceStatus;
export const getSequenceIds = (state) => state.courseUnit.courseSectionVertical.courseSequenceIds;
export const getCourseSectionVertical = (state) => state.courseUnit.courseSectionVertical;
export const getCourseId = state => state.courseDetail.courseId;
export const getSequenceId = state => state.courseUnit.sequenceId;
export const getCourseVerticalChildren = state => state.courseUnit.courseVerticalChildren;

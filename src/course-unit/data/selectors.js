export const getCourseUnitData = (state) => state.courseUnit.unit;

export const getSavingStatus = (state) => state.courseUnit.savingStatus;

export const getLoadingStatus = (state) => state.courseUnit.loadingStatus;

export function sequenceIdsSelector(state) {
  if (state.courseUnit.courseStatus !== 'LOADED') {
    return [];
  }
  const { sectionIds = [] } = state.models.coursewareMeta[state.courseDetail.courseId];

  return sectionIds
    .flatMap(sectionId => state.models.sections[sectionId].sequenceIds);
}

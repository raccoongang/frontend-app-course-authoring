import { RequestStatus } from '../../data/constants';

export const getCourseUnitData = (state) => state.courseUnit.unit;

export const getSavingStatus = (state) => state.courseUnit.savingStatus;

export const getLoadingStatus = (state) => state.courseUnit.loadingStatus;

export const getSequenceStatus = (state) => state.courseUnit.sequenceStatus;

export const getCourseSectionVertical = (state) => state.courseUnit.courseSectionVertical;

export function sequenceIdsSelector(state) {
  if (state.courseUnit.courseStatus !== RequestStatus.SUCCESSFUL) {
    return [];
  }
  const { sectionIds = [] } = state.models.coursewareMeta[state.courseDetail.courseId];

  return sectionIds
    .flatMap(sectionId => state.models.sections[sectionId].sequenceIds);
}

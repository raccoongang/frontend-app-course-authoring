import { RequestStatus } from '../../data/constants';
import { NOTIFICATION_MESSAGES } from '../../constants';
import {
  getCourseBestPracticesChecklist,
  getCourseLaunchChecklist,
} from '../utils/getChecklistForStatusBar';
import {
  deleteCourseSection,
  duplicateCourseSection,
  editCourseSection,
  enableCourseHighlightsEmails,
  getCourseBestPractices,
  getCourseLaunch,
  getCourseOutlineIndex,
  getCourseSection,
  publishCourseSection,
  restartIndexingOnCourse,
  updateCourseSectionHighlights,
} from './api';
import {
  fetchOutlineIndexSuccess,
  updateOutlineIndexLoadingStatus,
  updateReindexLoadingStatus,
  updateStatusBar,
  fetchStatusBarChecklistSuccess,
  fetchStatusBarSelPacedSuccess,
  updateSavingStatus,
  updateSectionList,
  updateFetchSectionLoadingStatus,
  deleteSection,
  updateSavingProcess,
  duplicateSection,
} from './slice';

export function fetchCourseOutlineIndexQuery(courseId) {
  return async (dispatch) => {
    dispatch(updateOutlineIndexLoadingStatus({ status: RequestStatus.IN_PROGRESS }));

    try {
      const outlineIndex = await getCourseOutlineIndex(courseId);
      const { courseReleaseDate, courseStructure: { highlightsEnabledForMessaging } } = outlineIndex;
      dispatch(fetchOutlineIndexSuccess(outlineIndex));
      dispatch(updateStatusBar({ courseReleaseDate, highlightsEnabledForMessaging }));

      dispatch(updateOutlineIndexLoadingStatus({ status: RequestStatus.SUCCESSFUL }));
      return true;
    } catch (error) {
      dispatch(updateOutlineIndexLoadingStatus({ status: RequestStatus.FAILED }));
      return false;
    }
  };
}

export function fetchCourseLaunchQuery({
  courseId,
  gradedOnly = true,
  validateOras = true,
  all = true,
}) {
  return async (dispatch) => {
    try {
      const data = await getCourseLaunch({
        courseId, gradedOnly, validateOras, all,
      });
      dispatch(fetchStatusBarSelPacedSuccess({ isSelfPaced: data.isSelfPaced }));
      dispatch(fetchStatusBarChecklistSuccess(getCourseLaunchChecklist(data)));

      return true;
    } catch (error) {
      return false;
    }
  };
}

export function fetchCourseBestPracticesQuery({
  courseId,
  excludeGraded = true,
  all = true,
}) {
  return async (dispatch) => {
    try {
      const data = await getCourseBestPractices({ courseId, excludeGraded, all });
      dispatch(fetchStatusBarChecklistSuccess(getCourseBestPracticesChecklist(data)));

      return true;
    } catch (error) {
      return false;
    }
  };
}

export function enableCourseHighlightsEmailsQuery(courseId) {
  return async (dispatch) => {
    dispatch(updateSavingStatus({ status: RequestStatus.PENDING }));

    try {
      await enableCourseHighlightsEmails(courseId);
      dispatch(fetchCourseOutlineIndexQuery(courseId));

      dispatch(updateSavingStatus({ status: RequestStatus.SUCCESSFUL }));
      return true;
    } catch (error) {
      dispatch(updateSavingStatus({ status: RequestStatus.FAILED }));
      return false;
    }
  };
}

export function fetchCourseReindexQuery(courseId, reindexLink) {
  return async (dispatch) => {
    dispatch(updateReindexLoadingStatus({ status: RequestStatus.IN_PROGRESS }));

    try {
      await restartIndexingOnCourse(reindexLink);
      dispatch(updateReindexLoadingStatus({ status: RequestStatus.SUCCESSFUL }));

      return true;
    } catch (error) {
      dispatch(updateReindexLoadingStatus({ status: RequestStatus.FAILED }));
      return false;
    }
  };
}

export function fetchCourseSectionQuery(sectionId) {
  return async (dispatch) => {
    dispatch(updateFetchSectionLoadingStatus({ status: RequestStatus.IN_PROGRESS }));

    try {
      const data = await getCourseSection(sectionId);
      dispatch(updateSectionList(data));
      dispatch(updateFetchSectionLoadingStatus({ status: RequestStatus.SUCCESSFUL }));

      return true;
    } catch (error) {
      dispatch(updateFetchSectionLoadingStatus({ status: RequestStatus.FAILED }));

      return false;
    }
  };
}

export function updateCourseSectionHighlightsQuery(sectionId, highlights) {
  return async (dispatch) => {
    dispatch(updateSavingStatus({ status: RequestStatus.IN_PROGRESS }));

    try {
      await updateCourseSectionHighlights(sectionId, highlights).then(async (result) => {
        if (result) {
          await dispatch(fetchCourseSectionQuery(sectionId));
          dispatch(updateSavingStatus({ status: RequestStatus.SUCCESSFUL }));
        }
      });
      return true;
    } catch (error) {
      dispatch(updateSavingStatus({ status: RequestStatus.FAILED }));
      return false;
    }
  };
}

export function publishCourseSectionQuery(sectionId) {
  return async (dispatch) => {
    dispatch(updateSavingStatus({ status: RequestStatus.IN_PROGRESS }));
    dispatch(updateSavingProcess(NOTIFICATION_MESSAGES.saving));

    try {
      await publishCourseSection(sectionId).then(async (result) => {
        if (result) {
          await dispatch(fetchCourseSectionQuery(sectionId));
          dispatch(updateSavingStatus({ status: RequestStatus.SUCCESSFUL }));
        }
      });
      return true;
    } catch (error) {
      dispatch(updateSavingStatus({ status: RequestStatus.FAILED }));
      return false;
    }
  };
}

export function editCourseSectionQuery(sectionId, displayName) {
  return async (dispatch) => {
    dispatch(updateSavingStatus({ status: RequestStatus.IN_PROGRESS }));
    dispatch(updateSavingProcess(NOTIFICATION_MESSAGES.saving));

    try {
      await editCourseSection(sectionId, displayName).then(async (result) => {
        if (result) {
          await dispatch(fetchCourseSectionQuery(sectionId));
          dispatch(updateSavingStatus({ status: RequestStatus.SUCCESSFUL }));
        }
      });
      return true;
    } catch (error) {
      dispatch(updateSavingStatus({ status: RequestStatus.FAILED }));
      return false;
    }
  };
}

export function deleteCourseSectionQuery(sectionId) {
  return async (dispatch) => {
    dispatch(updateSavingStatus({ status: RequestStatus.IN_PROGRESS }));
    dispatch(updateSavingProcess(NOTIFICATION_MESSAGES.deleting));

    try {
      await deleteCourseSection(sectionId);
      dispatch(deleteSection(sectionId));

      dispatch(updateSavingStatus({ status: RequestStatus.SUCCESSFUL }));
    } catch (error) {
      dispatch(updateSavingStatus({ status: RequestStatus.FAILED }));
    }
  };
}

export function duplicateCourseSectionQuery(sectionId, courseBlockId) {
  return async (dispatch) => {
    dispatch(updateSavingStatus({ status: RequestStatus.IN_PROGRESS }));
    dispatch(updateSavingProcess(NOTIFICATION_MESSAGES.saving));

    try {
      await duplicateCourseSection(sectionId, courseBlockId).then(async (result) => {
        if (result) {
          const duplicatedSection = await dispatch(fetchCourseSectionQuery(result.locator));
          dispatch(duplicateSection({ id: sectionId, duplicatedSection }));
          dispatch(updateSavingStatus({ status: RequestStatus.SUCCESSFUL }));
        }
      });

      return true;
    } catch (error) {
      dispatch(updateSavingStatus({ status: RequestStatus.FAILED }));
      return false;
    }
  };
}

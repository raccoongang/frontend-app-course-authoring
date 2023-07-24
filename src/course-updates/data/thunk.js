import {
  getCourseUpdates,
  getCourseHandouts,
  createCourseUpdate,
  editCourseUpdate,
  deleteCourseUpdate,
  editCourseHandouts,
} from './api';
import {
  fetchCourseUpdatesSuccess,
  createCourseUpdates,
  editCourseUpdates,
  deleteCourseUpdates,
  fetchCourseHandoutsSuccess,
  editCourseHandout,
} from './slice';

export function fetchCourseUpdatesQuery(courseId) {
  return async (dispatch) => {
    try {
      const courseUpdates = await getCourseUpdates(courseId);
      dispatch(fetchCourseUpdatesSuccess(courseUpdates));
      return true;
    } catch (error) {
      return false;
    }
  };
}

export function createCourseUpdateQuery(courseId, data) {
  return async (dispatch) => {
    try {
      const courseUpdate = await createCourseUpdate(courseId, data);
      dispatch(createCourseUpdates(courseUpdate));
      return true;
    } catch (error) {
      return false;
    }
  };
}

export function editCourseUpdateQuery(courseId, data) {
  return async (dispatch) => {
    try {
      const courseUpdate = await editCourseUpdate(courseId, data);
      dispatch(editCourseUpdates(courseUpdate));
      return true;
    } catch (error) {
      return false;
    }
  };
}

export function deleteCourseUpdateQuery(courseId, updateId) {
  return async (dispatch) => {
    try {
      const courseUpdates = await deleteCourseUpdate(courseId, updateId);
      dispatch(deleteCourseUpdates(courseUpdates));
      return true;
    } catch (error) {
      return false;
    }
  };
}

export function fetchCourseHandoutsQuery(courseId) {
  return async (dispatch) => {
    try {
      const courseHandouts = await getCourseHandouts(courseId);
      dispatch(fetchCourseHandoutsSuccess(courseHandouts));
      return true;
    } catch (error) {
      return false;
    }
  };
}

export function editCourseHandoutsQuery(courseId, data) {
  return async (dispatch) => {
    try {
      const courseHandouts = await editCourseHandouts(courseId, data);
      dispatch(editCourseHandout(courseHandouts));
      return true;
    } catch (error) {
      return false;
    }
  };
}

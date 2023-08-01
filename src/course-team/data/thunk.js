import { RequestStatus } from '../../data/constants';
import { getErrorEmailFromMessage } from '../utils';
import {
  getCourseTeam,
  deleteTeamUser,
  createTeamUser,
  changeRoleTeamUser,
} from './api';
import {
  fetchCourseTeamSuccess,
  deleteCourseTeamUser,
  updateSavingStatus,
  setErrorEmail,
} from './slice';

export function fetchCourseTeamQuery(courseId) {
  return async (dispatch) => {
    try {
      const courseTeam = await getCourseTeam(courseId);
      dispatch(fetchCourseTeamSuccess(courseTeam));
      return true;
    } catch (error) {
      return false;
    }
  };
}

export function createCourseTeamQuery(courseId, email) {
  return async (dispatch) => {
    dispatch(updateSavingStatus({ status: RequestStatus.IN_PROGRESS }));

    try {
      await createTeamUser(courseId, email);
      const courseTeam = await getCourseTeam(courseId);
      dispatch(fetchCourseTeamSuccess(courseTeam));

      dispatch(updateSavingStatus({ status: RequestStatus.SUCCESSFUL }));
      return true;
    } catch ({ message }) {
      dispatch(setErrorEmail(getErrorEmailFromMessage(message)));

      dispatch(updateSavingStatus({ status: RequestStatus.FAILED }));
      return false;
    }
  };
}

export function changeRoleTeamUserQuery(courseId, email, role) {
  return async (dispatch) => {
    dispatch(updateSavingStatus({ status: RequestStatus.IN_PROGRESS }));

    try {
      await changeRoleTeamUser(courseId, email, role);
      const courseTeam = await getCourseTeam(courseId);
      dispatch(fetchCourseTeamSuccess(courseTeam));

      dispatch(updateSavingStatus({ status: RequestStatus.SUCCESSFUL }));
      return true;
    } catch ({ message }) {
      dispatch(updateSavingStatus({ status: RequestStatus.FAILED }));
      return false;
    }
  };
}

export function deleteCourseTeamQuery(courseId, email) {
  return async (dispatch) => {
    dispatch(updateSavingStatus({ status: RequestStatus.IN_PROGRESS }));

    try {
      await deleteTeamUser(courseId, email);
      dispatch(deleteCourseTeamUser(email));

      dispatch(updateSavingStatus({ status: RequestStatus.SUCCESSFUL }));
      return true;
    } catch (error) {
      dispatch(updateSavingStatus({ status: RequestStatus.FAILED }));
      return false;
    }
  };
}

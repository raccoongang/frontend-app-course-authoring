/* eslint-disable import/prefer-default-export */
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

function normalizeCourseDetail(data) {
  return {
    id: data.course_id,
    ...camelCaseObject(data),
  };
}

export async function getCourseDetail(courseId, username) {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getConfig().LMS_BASE_URL}/api/courses/v1/courses/${courseId}?username=${username}`);

  return normalizeCourseDetail(data);
}

export async function getWaffleFlags(courseId) {
  const apiUrl = courseId
    ? `${getConfig().STUDIO_BASE_URL}/api/contentstore/v1/course_waffle_flags/${courseId}/`
    : `${getConfig().STUDIO_BASE_URL}/api/contentstore/v1/course_waffle_flags/`;
  const { data } = await getAuthenticatedHttpClient()
    .get(apiUrl);

  return normalizeCourseDetail(data);
}

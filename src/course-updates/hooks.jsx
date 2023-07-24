import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment/moment';
import { useEffect, useState } from 'react';
import { useToggle } from '@edx/paragon';

import { getCourseHandouts, getCourseUpdates } from './data/selectors';
import { REQUEST_TYPES } from './constants';
import { FORMATTED_DATE_FORMAT } from '../constants';
import {
  createCourseUpdateQuery,
  deleteCourseUpdateQuery,
  editCourseHandoutsQuery,
  editCourseUpdateQuery,
  fetchCourseHandoutsQuery,
  fetchCourseUpdatesQuery,
} from './data/thunk';

const useCourseUpdates = ({ courseId }) => {
  const dispatch = useDispatch();
  const initialUpdate = { id: 0, date: moment().utc().toDate(), content: '' };

  const [requestType, setRequestType] = useState('');
  const [isUpdateModalOpen, openUpdateModal, closeUpdateModal] = useToggle(false);
  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useToggle(false);
  const [currentUpdate, setCurrentUpdate] = useState(initialUpdate);

  const courseUpdates = useSelector(getCourseUpdates);
  const courseHandouts = useSelector(getCourseHandouts);

  const courseUpdatesInitialValues = requestType === REQUEST_TYPES.edit_handouts
    ? courseHandouts
    : currentUpdate;

  const handleOpenUpdateModal = (type, courseUpdate) => {
    setRequestType(type);

    if (type === REQUEST_TYPES.add_new_update) {
      setCurrentUpdate(initialUpdate);
    }
    if (type === REQUEST_TYPES.edit_update) {
      setCurrentUpdate(courseUpdate);
    }

    openUpdateModal();
  };

  const handleOpenDeleteUpdateModal = (courseUpdate) => {
    setRequestType(REQUEST_TYPES.delete_update);
    setCurrentUpdate(courseUpdate);
    openDeleteModal();
  };

  const handleUpdatesSubmit = (data) => {
    const dataToSend = {
      ...data,
      date: moment(data.date).format(FORMATTED_DATE_FORMAT),
    };
    const { id, date, content } = dataToSend;

    const handleSubmit = (handler) => {
      closeUpdateModal();
      return handler();
    };

    switch (requestType) {
    case REQUEST_TYPES.add_new_update:
      return handleSubmit(dispatch(createCourseUpdateQuery(courseId, { date, content })));
    case REQUEST_TYPES.edit_update:
      return handleSubmit(dispatch(editCourseUpdateQuery(courseId, { id, date, content })));
    case REQUEST_TYPES.edit_handouts:
      return handleSubmit(dispatch(editCourseHandoutsQuery(courseId, { ...data, data: data?.data || '' })));
    default:
      return true;
    }
  };

  const handleDeleteUpdateSubmit = () => {
    const { id } = currentUpdate;

    dispatch(deleteCourseUpdateQuery(courseId, id));
    closeDeleteModal();
  };

  useEffect(() => {
    dispatch(fetchCourseUpdatesQuery(courseId));
    dispatch(fetchCourseHandoutsQuery(courseId));
  }, [courseId]);

  return {
    requestType,
    courseUpdates,
    courseHandouts,
    courseUpdatesInitialValues,
    isUpdateModalOpen,
    isDeleteModalOpen,
    closeUpdateModal,
    closeDeleteModal,
    handleUpdatesSubmit,
    handleOpenUpdateModal,
    handleDeleteUpdateSubmit,
    handleOpenDeleteUpdateModal,
  };
};

// eslint-disable-next-line import/prefer-default-export
export { useCourseUpdates };

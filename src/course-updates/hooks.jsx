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
  const [isUpdateFormOpen, openUpdateForm, closeUpdateForm] = useToggle(false);
  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useToggle(false);
  const [currentUpdate, setCurrentUpdate] = useState(initialUpdate);

  const courseUpdates = useSelector(getCourseUpdates);
  const courseHandouts = useSelector(getCourseHandouts);

  const courseUpdatesInitialValues = requestType === REQUEST_TYPES.edit_handouts
    ? courseHandouts
    : currentUpdate;

  const handleOpenUpdateForm = (type, courseUpdate) => {
    setRequestType(type);

    if (type === REQUEST_TYPES.add_new_update) {
      setCurrentUpdate(initialUpdate);
    }
    if (type === REQUEST_TYPES.edit_update) {
      setCurrentUpdate(courseUpdate);
    }
    if (type !== REQUEST_TYPES.edit_update) {
      window.scrollTo(0, 0);
    }

    openUpdateForm();
  };

  const handleOpenDeleteUpdateForm = (courseUpdate) => {
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
      closeUpdateForm();
      setCurrentUpdate(initialUpdate);
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
    setCurrentUpdate(initialUpdate);
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
    isMainFormOpen: isUpdateFormOpen && requestType !== REQUEST_TYPES.edit_update,
    isInnerFormOpen: (id) => isUpdateFormOpen && currentUpdate.id === id && requestType === REQUEST_TYPES.edit_update,
    isUpdateFormOpen,
    isDeleteModalOpen,
    closeUpdateForm,
    closeDeleteModal,
    handleUpdatesSubmit,
    handleOpenUpdateForm,
    handleDeleteUpdateSubmit,
    handleOpenDeleteUpdateForm,
  };
};

// eslint-disable-next-line import/prefer-default-export
export { useCourseUpdates };

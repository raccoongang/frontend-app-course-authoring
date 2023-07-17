import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { injectIntl, useIntl } from '@edx/frontend-platform/i18n';

import {
  Button,
  Container,
  Layout,
  useToggle,
} from '@edx/paragon';
import { Add } from '@edx/paragon/icons';
import SubHeader from '../generic/sub-header/SubHeader';
import CourseHandouts from './course-handouts/CourseHandouts';
import CourseUpdate from './course-update/CourseUpdate';
import DeleteModal from './delete-modal/DeleteModal';
import UpdateModal from './update-modal/UpdateModal';

import {
  fetchCourseUpdatesQuery,
  fetchCourseHandoutsQuery,
  createCourseUpdateQuery,
  deleteCourseUpdateQuery,
  editCourseUpdateQuery,
  editCourseHandoutsQuery,
} from './data/thunk';
import { getCourseUpdates, getCourseHandouts } from './data/selectors';

import { FORMATTED_DATE_FORMAT } from '../constants';
import { requestTypes } from './constants';
import messages from './messages';

const CourseUpdates = ({ courseId }) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const initialUpdate = { id: 0, date: moment().utc().toDate(), content: '' };

  const [requestType, setRequestType] = useState('');
  const [isUpdateModalOpen, openUpdateModal, closeUpdateModal] = useToggle(false);
  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useToggle(false);
  const [currentUpdate, setCurrentUpdate] = useState(initialUpdate);

  const courseUpdates = useSelector(getCourseUpdates);
  const courseHandouts = useSelector(getCourseHandouts);

  const courseUpdatesInitialValues = requestType === requestTypes.edit_handouts
    ? courseHandouts
    : currentUpdate;

  const handleOpenUpdateModal = (type, courseUpdate) => {
    setRequestType(type);

    if (type === requestTypes.add_new_update) {
      setCurrentUpdate(initialUpdate);
    }
    if (type === requestTypes.edit_update) {
      setCurrentUpdate(courseUpdate);
    }

    openUpdateModal();
  };

  const handleOpenDeleteUpdateModal = (courseUpdate) => {
    setRequestType(requestTypes.delete_update);
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
    case requestTypes.add_new_update:
      return handleSubmit(dispatch(createCourseUpdateQuery(courseId, { date, content })));
    case requestTypes.edit_update:
      return handleSubmit(dispatch(editCourseUpdateQuery(courseId, { id, date, content })));
    case requestTypes.edit_handouts:
      return handleSubmit(dispatch(editCourseHandoutsQuery(courseId, data)));
    default:
      return true;
    }
  };

  const handleDeleteUpdateSubmit = () => {
    const currentCourseUpdateId = currentUpdate.id;

    dispatch(deleteCourseUpdateQuery(courseId, currentCourseUpdateId));
    closeDeleteModal();
  };

  useEffect(() => {
    dispatch(fetchCourseUpdatesQuery(courseId));
    dispatch(fetchCourseHandoutsQuery(courseId));
  }, [courseId]);

  return (
    <Container size="xl" className="m-4">
      <div className="mt-5" />
      <section className="setting-items mb-4">
        <Layout
          lg={[{ span: 9 }, { span: 3 }]}
          md={[{ span: 9 }, { span: 3 }]}
          sm={[{ span: 9 }, { span: 3 }]}
          xs={[{ span: 9 }, { span: 3 }]}
          xl={[{ span: 9 }, { span: 3 }]}
        >
          <Layout.Element>
            <article>
              <div>
                <SubHeader
                  title={intl.formatMessage(messages.headingTitle)}
                  subtitle={intl.formatMessage(messages.headingSubtitle)}
                  instruction={intl.formatMessage(messages.sectionInfo)}
                  headerActions={(
                    <Button
                      variant="outline-success"
                      iconBefore={Add}
                      size="sm"
                      onClick={() => handleOpenUpdateModal(requestTypes.add_new_update)}
                    >
                      {intl.formatMessage(messages.newUpdateButton)}
                    </Button>
                  )}
                />
                <section className="updates-section">
                  <div className="updates-container">
                    <div className="updates-info-container">
                      {courseUpdates.length ? courseUpdates.map((courseUpdate) => (
                        <CourseUpdate
                          updateDate={courseUpdate.date}
                          updateContent={courseUpdate.content}
                          onEdit={() => handleOpenUpdateModal(requestTypes.edit_update, courseUpdate)}
                          onDelete={() => handleOpenDeleteUpdateModal(courseUpdate)}
                        />
                      )) : null}
                    </div>
                    <div className="updates-handouts-container">
                      <CourseHandouts
                        handoutsContent={courseHandouts?.data || ''}
                        isExample
                        onEdit={() => handleOpenUpdateModal(requestTypes.edit_handouts)}
                      />
                    </div>
                    <UpdateModal
                      isOpen={isUpdateModalOpen}
                      close={closeUpdateModal}
                      requestType={requestType}
                      onSubmit={handleUpdatesSubmit}
                      courseUpdatesInitialValues={courseUpdatesInitialValues}
                    />
                    <DeleteModal
                      isOpen={isDeleteModalOpen}
                      close={closeDeleteModal}
                      onDeleteSubmit={handleDeleteUpdateSubmit}
                    />
                  </div>
                </section>
              </div>
            </article>
          </Layout.Element>
        </Layout>
      </section>
    </Container>
  );
};

CourseUpdates.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default injectIntl(CourseUpdates);

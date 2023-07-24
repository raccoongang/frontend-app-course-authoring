import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, useIntl } from '@edx/frontend-platform/i18n';
import {
  Button,
  Container,
  Layout,
} from '@edx/paragon';
import { Add as AddIcon } from '@edx/paragon/icons';

import SubHeader from '../generic/sub-header/SubHeader';
import CourseHandouts from './course-handouts/CourseHandouts';
import CourseUpdate from './course-update/CourseUpdate';
import DeleteModal from './delete-modal/DeleteModal';
import UpdateModal from './update-modal/UpdateModal';

import { REQUEST_TYPES } from './constants';
import messages from './messages';
import { useCourseUpdates } from './hooks';

const CourseUpdates = ({ courseId }) => {
  const intl = useIntl();

  const {
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
  } = useCourseUpdates({ courseId });

  return (
    <Container size="xl" className="m-4">
      <section className="setting-items mb-4 course-updates-container">
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
                      iconBefore={AddIcon}
                      size="sm"
                      onClick={() => handleOpenUpdateModal(REQUEST_TYPES.add_new_update)}
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
                          onEdit={() => handleOpenUpdateModal(REQUEST_TYPES.edit_update, courseUpdate)}
                          onDelete={() => handleOpenDeleteUpdateModal(courseUpdate)}
                        />
                      )) : null}
                    </div>
                    <div className="updates-handouts-container">
                      <CourseHandouts
                        handoutsContent={courseHandouts?.data || ''}
                        onEdit={() => handleOpenUpdateModal(REQUEST_TYPES.edit_handouts)}
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

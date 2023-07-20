import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl, injectIntl } from '@edx/frontend-platform/i18n';
import {
  Button,
  Container,
  Layout,
  useToggle,
} from '@edx/paragon';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { Add } from '@edx/paragon/icons';
import { useDispatch, useSelector } from 'react-redux';
import SubHeader from '../generic/sub-header/SubHeader';
import messages from './messages';
import CourseTeamSideBar from './course-team-sidebar/CourseTeamSidebar';
import AddUserForm from './add-user-form/AddUserForm';
import AddTeamMember from './add-team-member/AddTeamMember';
import CourseTeamMember from './course-team-member/CourseTeamMember';

import {
  fetchCourseTeamQuery,
  deleteCourseTeamQuery,
  createCourseTeamQuery,
  changeRoleTeamUserQuery,
} from './data/thunk';
import {
  getCourseTeamUsers,
  getErrorEmail,
  getIsAllowActions,
  getIsOwnershipHint,
} from './data/selectors';
import { MODAL_TYPES, USER_ROLES } from './enum';
import { useModel } from '../generic/model-store';
import { setErrorEmail } from './data/slice';
import InfoModal from './info-modal/InfoModal';

const CourseTeam = ({ courseId }) => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const { email: currentUserEmail } = getAuthenticatedUser();
  const courseDetails = useModel('courseDetails', courseId);

  const [modalType, setModalType] = useState('delete');
  const [isInfoModalOpen, openInfoModal, closeInfoModal] = useToggle(false);
  const [isFormVisible, openForm, hideForm] = useToggle(false);
  const [currentEmail, setCurrentEmail] = useState('');

  const courseTeamUsers = useSelector(getCourseTeamUsers);
  const errorEmail = useSelector(getErrorEmail);
  const isAllowActions = useSelector(getIsAllowActions);
  const isOwnershipHint = useSelector(getIsOwnershipHint);
  const isSingleAdmin = courseTeamUsers.filter((user) => user.role === USER_ROLES.admin).length === 1;

  const handleOpenInfoModal = (type, email) => {
    setCurrentEmail(email);
    setModalType(type);
    openInfoModal();
  };

  const handleCloseInfoModal = () => {
    dispatch(setErrorEmail(''));
    closeInfoModal();
  };

  const handleAddUserSubmit = (data) => {
    const { email } = data;
    const isUserContains = courseTeamUsers.some((user) => user.email === email);

    setCurrentEmail(email);

    if (isUserContains) {
      handleOpenInfoModal(MODAL_TYPES.warning, email);
      return;
    }

    dispatch(createCourseTeamQuery(courseId, email)).then((result) => {
      if (result) {
        hideForm();
        dispatch(setErrorEmail(''));
        return;
      }

      handleOpenInfoModal(MODAL_TYPES.error, email);
    });
  };

  const handleDeleteUserSubmit = () => {
    dispatch(deleteCourseTeamQuery(courseId, currentEmail));
    handleCloseInfoModal();
  };

  const handleChangeRoleUserSubmit = (email, role) => {
    dispatch(changeRoleTeamUserQuery(courseId, email, role));
  };

  useEffect(() => {
    dispatch(fetchCourseTeamQuery(courseId));
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
                  contentTitle=""
                  headerActions={isAllowActions ? (
                    <Button
                      variant="outline-success"
                      iconBefore={Add}
                      size="sm"
                      onClick={openForm}
                      disabled={isFormVisible}
                    >
                      {intl.formatMessage(messages.addNewMemberButton)}
                    </Button>
                  ) : null}
                />
                <section className="course-team-section">
                  <div className="members-container">
                    {isFormVisible ? (
                      <AddUserForm
                        onSubmit={handleAddUserSubmit}
                        onCancel={hideForm}
                      />
                    ) : null}
                    {courseTeamUsers.length ? courseTeamUsers.map(({ username, role, email }) => (
                      <CourseTeamMember
                        key={email}
                        userName={username}
                        role={role}
                        email={email}
                        currentUserEmail={currentUserEmail || ''}
                        isAllowActions={isAllowActions}
                        isHideActions={role === USER_ROLES.admin && isSingleAdmin}
                        onChangeRole={handleChangeRoleUserSubmit}
                        onDelete={() => handleOpenInfoModal(MODAL_TYPES.delete, email)}
                      />
                    )) : null}
                    {courseTeamUsers.length === 1 && isAllowActions ? (
                      <AddTeamMember
                        onFormOpen={openForm}
                        isButtonDisable={isFormVisible}
                      />
                    ) : null}
                  </div>
                  {!courseTeamUsers.length && !isFormVisible ? (
                    <div className="sidebar-container">
                      <CourseTeamSideBar
                        courseId={courseId}
                        isOwnershipHint={isOwnershipHint}
                      />
                    </div>
                  ) : null}
                  <InfoModal
                    isOpen={isInfoModalOpen}
                    close={closeInfoModal}
                    currentEmail={currentEmail}
                    errorEmail={errorEmail}
                    courseName={courseDetails?.name || ''}
                    modalType={modalType}
                    onDeleteSubmit={handleDeleteUserSubmit}
                  />
                </section>
              </div>
            </article>
          </Layout.Element>
          <Layout.Element>
            {courseTeamUsers.length || isFormVisible ? (
              <CourseTeamSideBar
                courseId={courseId}
                isOwnershipHint={isOwnershipHint}
              />
            ) : null}
          </Layout.Element>
        </Layout>
      </section>
    </Container>
  );
};

CourseTeam.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default injectIntl(CourseTeam);

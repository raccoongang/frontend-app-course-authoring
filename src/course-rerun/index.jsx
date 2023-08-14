import React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Layout,
  Stack,
  ActionRow,
  Button,
} from '@edx/paragon';
import { history } from '@edx/frontend-platform';

import Header from '../studio-header/Header';
import InternetConnectionAlert from '../generic/internet-connection-alert';
import { RequestStatus } from '../data/constants';
import { updateSavingStatus } from '../generic/data/slice';
import { updateCreateOrRerunCourseQuery } from '../generic/data/thunks';
import CourseRerunForm from './course-rerun-form';
import CourseRerunSideBar from './course-rerun-sidebar';
import messages from './messages';
import { useCourseRerun } from './hooks';

const CourseRerun = ({ courseId }) => {
  const {
    intl,
    courseData,
    displayName,
    savingStatus,
    initialFormValues,
    originalCourseData,
    dispatch,
  } = useCourseRerun(courseId);

  const handleRerunCourseCancel = () => {
    history.push('/home');
  };

  const handleCreateRerunCourse = () => {
    dispatch(updateSavingStatus({ status: RequestStatus.PENDING }));
  };

  const handleQueryProcessing = () => {
    dispatch(updateCreateOrRerunCourseQuery(courseData));
  };

  const handleInternetConnectionFailed = () => {
    dispatch(updateSavingStatus({ status: RequestStatus.FAILED }));
  };

  return (
    <>
      <Header hideMainMenu />
      <Container size="xl" className="m-4">
        <section className="mb-4">
          <article>
            <section>
              <header className="d-flex">
                <h3 className="align-self-center font-weight-normal mb-0">{intl.formatMessage(messages.rerunTitle)}</h3>
                <ActionRow className="ml-auto">
                  <Button variant="outline-primary" onClick={handleRerunCourseCancel}>
                    {intl.formatMessage(messages.cancelButton)}
                  </Button>
                </ActionRow>
              </header>
              <hr />
              <Stack>
                <h3>{originalCourseData}</h3>
                <h2>{displayName}</h2>
              </Stack>
              <hr />
            </section>
          </article>
          <Layout
            lg={[{ span: 9 }, { span: 3 }]}
            md={[{ span: 9 }, { span: 3 }]}
            sm={[{ span: 9 }, { span: 3 }]}
            xs={[{ span: 9 }, { span: 3 }]}
            xl={[{ span: 9 }, { span: 3 }]}
          >
            <Layout.Element>
              <CourseRerunForm
                initialFormValues={initialFormValues}
                handleOnClickCancel={handleRerunCourseCancel}
                handleOnClickCreate={handleCreateRerunCourse}
              />
            </Layout.Element>
            <Layout.Element>
              <CourseRerunSideBar />
            </Layout.Element>
          </Layout>
        </section>
      </Container>
      <div className="alert-toast">
        <InternetConnectionAlert
          isFailed={savingStatus === RequestStatus.FAILED}
          isQueryPending={savingStatus === RequestStatus.PENDING}
          onQueryProcessing={handleQueryProcessing}
          onInternetConnectionFailed={handleInternetConnectionFailed}
        />
      </div>
    </>
  );
};

CourseRerun.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default CourseRerun;

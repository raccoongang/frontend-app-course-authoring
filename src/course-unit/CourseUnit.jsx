import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useIntl, injectIntl } from '@edx/frontend-platform/i18n';
import { Container, Layout } from '@edx/paragon';
import { ErrorAlert } from '@edx/frontend-lib-content-components';

import { RequestStatus } from '../data/constants';
import PageSubHeader from './page-sub-header/PageSubHeader';
import getPageHeadTitle from '../generic/utils';
import ProcessingNotification from '../generic/processing-notification';
import InternetConnectionAlert from '../generic/internet-connection-alert';
import { getProcessingNotification } from '../generic/processing-notification/data/selectors';
import Sequence from './course-sequence';

import { useCourseUnit } from './hooks';
import messages from './messages';
import './CourseUnit.scss';

const CourseUnit = ({ courseId }) => {
  const { sequenceId, blockId } = useParams();
  const intl = useIntl();
  const {
    isLoading,
    breadcrumbsData,
    unitTitle,
    savingStatus,
    isTitleFormOpen,
    isInternetConnectionAlertFailed,
    handleTitleEditSubmit,
    headerNavigationsActions,
    handleTitleEdit,
    handleInternetConnectionFailed,
  } = useCourseUnit({ intl, courseId, blockId });
  // console.log('blockId', blockId);
  document.title = getPageHeadTitle('', unitTitle);

  const {
    isShow: isShowProcessingNotification,
    title: processingNotificationTitle,
  } = useSelector(getProcessingNotification);

  const handleUnitNavigationClick = () => {
    console.log('handleUnitNavigationClick');
  };

  const handleNextSequenceClick = () => {};

  const handlePreviousSequenceClick = () => {};

  if (isLoading) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

  return (
    <>
      <Container size="xl" className="course-unit px-4">
        <section className="course-unit-container mb-4 mt-5">
          <ErrorAlert hideHeading isError={savingStatus === RequestStatus.FAILED}>
            {intl.formatMessage(messages.alertFailedGeneric, { actionName: 'save', type: 'changes' })}
          </ErrorAlert>
          <PageSubHeader
            courseId={courseId}
            breadcrumbsData={breadcrumbsData}
            unitTitle={unitTitle}
            isTitleFormOpen={isTitleFormOpen}
            handleTitleEdit={handleTitleEdit}
            handleTitleEditSubmit={handleTitleEditSubmit}
            headerNavigationsActions={headerNavigationsActions}
          />
          <Sequence
            courseId={courseId}
            sequenceId={sequenceId}
            unitId={blockId}
            unitNavigationHandler={handleUnitNavigationClick}
            nextSequenceHandler={handleNextSequenceClick}
            previousSequenceHandler={handlePreviousSequenceClick}
          />
          <Layout
            lg={[{ span: 9 }, { span: 3 }]}
            md={[{ span: 9 }, { span: 3 }]}
            sm={[{ span: 9 }, { span: 3 }]}
            xs={[{ span: 9 }, { span: 3 }]}
            xl={[{ span: 9 }, { span: 3 }]}
          >
            <Layout.Element>
              Content
            </Layout.Element>
          </Layout>
        </section>
      </Container>
      <div className="alert-toast">
        <ProcessingNotification
          isShow={isShowProcessingNotification}
          title={processingNotificationTitle}
        />
        <InternetConnectionAlert
          isFailed={isInternetConnectionAlertFailed}
          isQueryPending={savingStatus === RequestStatus.PENDING}
          onInternetConnectionFailed={handleInternetConnectionFailed}
        />
      </div>
    </>
  );
};

CourseUnit.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default injectIntl(CourseUnit);

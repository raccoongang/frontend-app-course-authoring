import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Container,
  Layout,
  TransitionReplace,
} from '@edx/paragon';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@edx/paragon/icons';

import SubHeader from '../generic/sub-header/SubHeader';
import AlertMessage from '../generic/alert-message';
import HeaderNavigations from './header-navigations/HeaderNavigations';
import OutlineSideBar from './outline-sidebar/OutlineSidebar';
import messages from './messages';
import { useCourseOutline } from './hooks';

const CourseOutline = ({ courseId }) => {
  const intl = useIntl();

  const {
    isLoading,
    isReIndexShow,
    showErrorAlert,
    showSuccessAlert,
    isSectionsExpanded,
    isReindexButtonDisable,
    headerNavigationsActions,
  } = useCourseOutline({ courseId });

  if (isLoading) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

  return (
    <>
      <Container size="xl" className="m-4">
        <section className="course-outline-container mb-4 mt-5">
          <TransitionReplace>
            {showSuccessAlert ? (
              <AlertMessage
                key={intl.formatMessage(messages.alertSuccessAriaLabelledby)}
                show={showSuccessAlert}
                variant="success"
                icon={CheckCircleIcon}
                title={intl.formatMessage(messages.alertSuccessTitle)}
                description={intl.formatMessage(messages.alertSuccessDescription)}
                aria-hidden="true"
                aria-labelledby={intl.formatMessage(messages.alertSuccessAriaLabelledby)}
                aria-describedby={intl.formatMessage(messages.alertSuccessAriaDescribedby)}
              />
            ) : null}
          </TransitionReplace>
          <SubHeader
            className="mt-5"
            title={intl.formatMessage(messages.headingTitle)}
            subtitle={intl.formatMessage(messages.headingSubtitle)}
            withSubHeaderContent={false}
            headerActions={(
              <HeaderNavigations
                isReIndexShow={isReIndexShow}
                isSectionsExpanded={isSectionsExpanded}
                headerNavigationsActions={headerNavigationsActions}
                isReindexButtonDisable={isReindexButtonDisable}
              />
            )}
          />
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
                  <section className="course-outline-section">
                    {/* TODO add status bar and list of outlines */}
                  </section>
                </div>
              </article>
            </Layout.Element>
            <Layout.Element>
              <OutlineSideBar courseId={courseId} />
            </Layout.Element>
          </Layout>
        </section>
      </Container>
      <div className="alert-toast">
        {showErrorAlert && (
          <AlertMessage
            key={intl.formatMessage(messages.alertErrorTitle)}
            show={showErrorAlert}
            variant="danger"
            icon={WarningIcon}
            title={intl.formatMessage(messages.alertErrorTitle)}
            aria-hidden="true"
          />
        )}
      </div>
    </>
  );
};

CourseOutline.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default CourseOutline;

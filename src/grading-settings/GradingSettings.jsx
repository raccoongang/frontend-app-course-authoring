import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Container, Layout } from '@edx/paragon';
import React, { useContext } from 'react';
import { AppContext } from '@edx/frontend-platform/react';
import PropTypes from 'prop-types';
import messages from '../advanced-settings/messages';
import SettingsSidebar from '../generic/settings-sidebar/SettingsSidebar';
import GradingRanger from './GradingRanger';
import { getPagePath } from '../utils';

const GradingSettings = ({ intl, courseId }) => {
    const { config } = useContext(AppContext);

    return (
      <Container size="xl">
        <div className="setting-header mt-5">
          <header className="setting-header-inner">
            <h1 className="grading-header-title">
              {/* eslint-disable-next-line react/prop-types */}
              <small
                className="grading-header-title-subtitle"
              >{intl.formatMessage(messages.headingSubtitle)}
              </small>
              Grading
            </h1>
          </header>
        </div>
        <div>
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
                    <section className="grading-items-policies">
                      <header>
                        <h2 className="grading-items-policies-title">Overall Grade Range</h2>
                      </header>
                      <p className="grading-items-policies-instructions mb-4">
                        Your overall grading scale for student final grades
                      </p>
                      <GradingRanger />
                    </section>
                  </div>
                </article>
              </Layout.Element>
              <Layout.Element>
                <SettingsSidebar
                  courseId={courseId}
                  title="What can I do on this page?"
                  links={[
                    {
                        name: intl.formatMessage(messages.otherCourseSettingsLinkToScheduleAndDetails),
                        destination: getPagePath(courseId, process.env.ENABLE_NEW_SCHEDULE_DETAILS_PAGE, 'settings/details'),
                    },
                    {
                        name: intl.formatMessage(messages.otherCourseSettingsLinkToCourseTeam),
                        destination: getPagePath(courseId, process.env.ENABLE_NEW_COURSE_TEAM_PAGE, 'course_team'),
                    },
                    {
                        name: intl.formatMessage(messages.otherCourseSettingsLinkToGroupConfigurations),
                        destination: `${config.STUDIO_BASE_URL}/group_configurations/${courseId}`,
                    },
                    {
                    name: 'Advanced Settings',
                    destination: getPagePath(courseId, process.env.ENABLE_NEW_ADVANCED_SETTINGS_PAGE, 'settings/advanced'),
                    },
                  ]}
                >
                  <p className="setting-sidebar-supplementary-about-descriptions">
                    You can use the slider under Overall Grade Range to specify whether your course is
                    pass/fail
                    or graded by letter, and to establish the thresholds for each grade.
                  </p>
                  <p className="setting-sidebar-supplementary-about-descriptions">
                    You can specify whether your course offers students a grace period for late
                    assignments.
                  </p>
                  <p className="setting-sidebar-supplementary-about-descriptions">
                    You can also create assignment types, such as homework, labs, quizzes, and exams,
                    and specify how
                    much of a students grade each assignment type is worth.
                  </p>
                </SettingsSidebar>
              </Layout.Element>
            </Layout>
          </section>
        </div>
      </Container>
    );
};

GradingSettings.propTypes = {
    intl: intlShape.isRequired,
    courseId: PropTypes.string.isRequired,
};

export default injectIntl(GradingSettings);

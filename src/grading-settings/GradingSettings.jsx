import React from 'react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Container, Layout } from '@edx/paragon';
import PropTypes from 'prop-types';

import messages from '../advanced-settings/messages';
import GradingScale from './GradingScale';
import GradingSidebar from './grading-sidebar';

const GradingSettings = ({ intl, courseId }) => (
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
                  <GradingScale />
                </section>
              </div>
            </article>
          </Layout.Element>
          <Layout.Element>
            <GradingSidebar courseId={courseId} intl={intl} gradingUrl="" />
          </Layout.Element>
        </Layout>
      </section>
    </div>
  </Container>
);

GradingSettings.propTypes = {
  intl: intlShape.isRequired,
  courseId: PropTypes.string.isRequired,
};

export default injectIntl(GradingSettings);

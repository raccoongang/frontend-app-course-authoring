import React from 'react';
import PropTypes from 'prop-types';
import { useIntl, injectIntl } from '@edx/frontend-platform/i18n';
import {
  Button,
  Container,
  Layout,
} from '@edx/paragon';
import { Add } from '@edx/paragon/icons';
import SubHeader from '../generic/sub-header/SubHeader';
import messages from './messages';

const CourseTeam = ({ courseId }) => {
  const intl = useIntl();

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
                  headerActions={(
                    <Button
                      variant="outline-success"
                      iconBefore={Add}
                      size="sm"
                    >
                      {courseId}
                    </Button>
                  )}
                />
                <section className="team-members-section" />
              </div>
            </article>
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

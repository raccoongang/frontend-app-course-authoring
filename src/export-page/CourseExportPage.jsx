import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import {
  Container, Layout, Button, Card,
} from '@edx/paragon';
import { ArrowCircleDown } from '@edx/paragon/icons';
import Cookies from 'universal-cookie';
import messages from './messages';
import ExportSidebar from './export-sidebar/ExportSidebar';
import ExportStepper from './export-stepper/ExportStepper';
import { getExportTriggered } from './data/selectors';
import { startExportingCourse } from './data/thunks';
import SubHeader from '../generic/sub-header/SubHeader';
import { LAST_EXPORT_COOKIE_NAME } from './data/constants';
import { updateExportTriggered, updateSuccessDate } from './data/slice';
import ExportModalError from './export-modal-error/ExportModalError';
import ExportFooter from './export-footer/ExportFooter';

const CourseExportPage = ({ intl, courseId }) => {
  const dispatch = useDispatch();
  const exportTriggered = useSelector(getExportTriggered);
  const cookies = new Cookies();

  useEffect(() => {
    const cookieData = cookies.get(LAST_EXPORT_COOKIE_NAME);
    if (cookieData) {
      dispatch(updateExportTriggered(true));
      dispatch(updateSuccessDate(cookieData.date));
    }
  }, []);

  const onButtonClick = () => {
    if (!exportTriggered) {
      dispatch(startExportingCourse(courseId));
    }
  };

  return (
    <Container size="xl" className="m-4">
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
              <SubHeader
                title={intl.formatMessage(messages.headingTitle)}
                subtitle={intl.formatMessage(messages.headingSubtitle)}
              />
              <p>{intl.formatMessage(messages.description1)}</p>
              <p>{intl.formatMessage(messages.description2)}</p>
              <Card>
                <Card.Header
                  className="h3 px-3 text-black"
                  title={intl.formatMessage(messages.titleUnderButton)}
                  size="m"
                />
                <Card.Section className="px-3 py-1">
                  <Button variant="primary" onClick={onButtonClick} iconBefore={ArrowCircleDown}>
                    {intl.formatMessage(messages.buttonTitle)}
                  </Button>
                </Card.Section>
              </Card>
              {exportTriggered && <ExportStepper courseId={courseId} />}
              <ExportFooter />
            </article>
          </Layout.Element>
          <Layout.Element>
            <ExportSidebar courseId={courseId} />
          </Layout.Element>
        </Layout>
      </section>
      <ExportModalError courseId={courseId} />
    </Container>
  );
};

CourseExportPage.propTypes = {
  intl: intlShape.isRequired,
  courseId: PropTypes.string.isRequired,
};

CourseExportPage.defaultProps = {};

export default injectIntl(CourseExportPage);

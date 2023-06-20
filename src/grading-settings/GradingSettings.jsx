import React, { useEffect, useState } from 'react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Button, Container, Layout } from '@edx/paragon';
import PropTypes from 'prop-types';

import { CheckCircle as CheckCircleIcon, WarningFilled as WarningFilledIcon } from '@edx/paragon/icons/es5';
import { useDispatch, useSelector } from 'react-redux';
import messages from '../advanced-settings/messages';
import GradingScale from './GradingScale';
import GradingSidebar from './grading-sidebar';
import AlertMessage from '../generic/alert-message';

import { getGradingSettings } from './data/selectors';
import { fetchCourseAppSettings } from '../advanced-settings/data/thunks';
import { fetchGradingSettings } from './data/thunks';

const GradingSettings = ({ intl, courseId }) => {
  const gradingSettingsData = useSelector(getGradingSettings);
  const [saveValuesPrompt, showSaveValuesPrompt] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCourseAppSettings(courseId));
    dispatch(fetchGradingSettings(courseId));
  }, [courseId]);

  return (
    <>
      <Container size="xl">
        <div className="setting-header mt-5">
          <AlertMessage
            variant="success"
            icon={CheckCircleIcon}
            title="Your changes have been saved."
            aria-hidden="true"
            aria-labelledby={intl.formatMessage(
              messages.alertSuccessAriaLabelledby,
            )}
            aria-describedby={intl.formatMessage(
              messages.alertSuccessAriaDescribedby,
            )}
          />
          <header className="setting-header-inner">
            <h1 className="grading-header-title">
              <small className="grading-header-title-subtitle">
                {intl.formatMessage(messages.headingSubtitle)}
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
                      <GradingScale showSavePrompt={showSaveValuesPrompt} data={gradingSettingsData} />
                    </section>
                  </div>
                </article>
              </Layout.Element>
              <Layout.Element>
                <GradingSidebar courseId={courseId} intl={intl} />
              </Layout.Element>
            </Layout>
          </section>
        </div>
      </Container>
      <div className="alert-toast">
        <AlertMessage
          show={saveValuesPrompt}
          aria-hidden={saveValuesPrompt}
          aria-labelledby={intl.formatMessage(
            messages.alertWarningAriaLabelledby,
          )}
          aria-describedby={intl.formatMessage(
            messages.alertWarningAriaDescribedby,
          )}
          role="dialog"
          actions={[
            // eslint-disable-next-line no-alert
            <Button onClick={() => alert('Saved!')}>
              {intl.formatMessage(messages.buttonSaveText)}
            </Button>,
            <Button variant="tertiary" onClick={() => showSaveValuesPrompt(false)}>
              {intl.formatMessage(messages.buttonCancelText)}
            </Button>,
          ]}
          variant="warning"
          icon={WarningFilledIcon}
          title={intl.formatMessage(messages.alertWarning)}
          description="Your changes will not take effect until you save your progress."
        />
      </div>
    </>
  );
};

GradingSettings.propTypes = {
  intl: intlShape.isRequired,
  courseId: PropTypes.string.isRequired,
};

export default injectIntl(GradingSettings);

import React, { useEffect, useState } from 'react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Button, Container, Layout } from '@edx/paragon';
import PropTypes from 'prop-types';
import { CheckCircle as CheckCircleIcon, WarningFilled as WarningFilledIcon } from '@edx/paragon/icons/es5';
import { useDispatch, useSelector } from 'react-redux';

import AlertMessage from '../generic/alert-message';
import { RequestStatus } from '../data/constants';
import messages from '../advanced-settings/messages';
import { getGradingSettings, getSavingStatus, getLoadingStatus } from './data/selectors';
import { fetchGradingSettings, sendGradingSetting } from './data/thunks';
import GradingScale from './GradingScale';
import GradingSidebar from './grading-sidebar';

const GradingSettings = ({ intl, courseId }) => {
  const gradingSettingsData = useSelector(getGradingSettings);
  const [gradingData, setGradingData] = useState([]);
  const savingStatus = useSelector(getSavingStatus);
  const loadingStatus = useSelector(getLoadingStatus);
  const [saveValuesPrompt, showSaveValuesPrompt] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const dispatch = useDispatch();
  const isLoading = loadingStatus === RequestStatus.IN_PROGRESS;

  useEffect(() => {
    if (savingStatus === RequestStatus.SUCCESSFUL) {
      setShowSuccessAlert(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (savingStatus === RequestStatus.FAILED) {
      console.log('Error saving');
    }
  }, [savingStatus]);

  useEffect(() => {
    dispatch(fetchGradingSettings(courseId));
  }, [courseId]);

  useEffect(() => {
    if (gradingSettingsData) {
      setGradingData(gradingSettingsData);
    }
  }, [gradingSettingsData]);

  if (isLoading) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

  const handleSendGradingSettingsData = () => {
    dispatch(sendGradingSetting(courseId, gradingData));
    showSaveValuesPrompt(!saveValuesPrompt);
  };

  return (
    <>
      <Container size="xl">
        <div className="setting-header mt-5">
          <AlertMessage
            show={showSuccessAlert}
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
                      <GradingScale
                        showSavePrompt={showSaveValuesPrompt}
                        gradeCutoffs={gradingData?.gradeCutoffs}
                        setShowSuccessAlert={setShowSuccessAlert}
                        setGradingData={setGradingData}
                      />
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
            <Button onClick={handleSendGradingSettingsData}>
              {intl.formatMessage(messages.buttonSaveText)}
            </Button>,
            <Button variant="tertiary" onClick={() => showSaveValuesPrompt(!saveValuesPrompt)}>
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

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Container, Layout, Button } from '@edx/paragon';
import { CheckCircle, Warning } from '@edx/paragon/icons';

import AlertMessage from '../generic/alert-message';
import { RequestStatus } from '../data/constants';
import { getGradingSettings, getSavingStatus, getLoadingStatus } from './data/selectors';
import { fetchGradingSettings, sendGradingSetting } from './data/thunks';
import GradingScale from './grading-scale/GradingScale';
import GradingSidebar from './grading-sidebar';
import messages from './messages';
import { getGradingValues, getSortedGrades } from './grading-scale/utils';

const GradingSettings = ({ intl, courseId }) => {
  const gradingSettingsData = useSelector(getGradingSettings);
  const [gradingData, setGradingData] = useState({});
  const savingStatus = useSelector(getSavingStatus);
  const loadingStatus = useSelector(getLoadingStatus);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const dispatch = useDispatch();
  const isLoading = loadingStatus === RequestStatus.IN_PROGRESS;
  const resetDataRef = useRef(false);
  const { gradeCutoffs } = gradingData;
  const gradeLetters = gradeCutoffs && Object.keys(gradeCutoffs);
  const gradeValues = gradeCutoffs && getGradingValues(gradeCutoffs);
  const sortedGrades = gradeCutoffs && getSortedGrades(gradeValues);

  useEffect(() => {
    if (savingStatus === RequestStatus.SUCCESSFUL) {
      setShowSuccessAlert(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    setShowSavePrompt(!showSavePrompt);
  };

  return (
    <>
      <Container size="xl" className="m-4">
        <div className="setting-header mt-5">
          <AlertMessage
            show={showSuccessAlert}
            variant="success"
            icon={CheckCircle}
            title={intl.formatMessage(messages.alertSuccess)}
            aria-hidden="true"
            aria-labelledby={intl.formatMessage(messages.alertSuccessAriaLabelledby)}
            aria-describedby={intl.formatMessage(messages.alertSuccessAriaDescribedby)}
          />
          <header className="setting-header-inner">
            <h1 className="grading-header-title">
              <small className="grading-header-title-subtitle">
                {intl.formatMessage(messages.headingSubtitle)}
              </small>
              {intl.formatMessage(messages.headingTitle)}
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
                        <h2 className="grading-items-policies-title">
                          {intl.formatMessage(messages.policy)}
                        </h2>
                      </header>
                      <p className="grading-items-policies-instructions mb-4">
                        {intl.formatMessage(messages.policiesDescription)}
                      </p>
                      <GradingScale
                        gradeCutoffs={gradeCutoffs || {}}
                        showSavePrompt={setShowSavePrompt}
                        gradeLetters={gradeLetters}
                        gradeValues={gradeValues}
                        sortedGrades={sortedGrades}
                        setShowSuccessAlert={setShowSuccessAlert}
                        setGradingData={setGradingData}
                        resetDataRef={resetDataRef}
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
          show={showSavePrompt}
          aria-hidden={!showSavePrompt}
          aria-labelledby={intl.formatMessage(messages.alertWarningAriaLabelledby)}
          aria-describedby={intl.formatMessage(messages.alertWarningAriaDescribedby)}
          data-testid="grading-settings-save-alert"
          role="dialog"
          actions={[
            <Button
              variant="tertiary"
              onClick={() => {
                setShowSavePrompt(!showSavePrompt);
                setGradingData(gradingSettingsData);
                resetDataRef.current = true;
              }}
            >
              {intl.formatMessage(messages.buttonCancelText)}
            </Button>,
            <Button onClick={handleSendGradingSettingsData}>
              {intl.formatMessage(messages.buttonSaveText)}
            </Button>,
          ]}
          variant="warning"
          icon={Warning}
          title={intl.formatMessage(messages.alertWarning)}
          description={intl.formatMessage(messages.alertWarningDescriptions)}
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

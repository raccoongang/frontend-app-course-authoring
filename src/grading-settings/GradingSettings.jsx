import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Container, Layout, Button } from '@edx/paragon';
import { CheckCircle, Warning, Add as IconAdd } from '@edx/paragon/icons';

import AlertMessage from '../generic/alert-message';
import { RequestStatus } from '../data/constants';
import InternetConnectionAlert from '../generic/internet-connection-alert';
import SubHeader from '../generic/sub-header/SubHeader';
import SectionSubHeader from '../generic/section-sub-header';
import {
  getGradingSettings, getCourseAssignmentLists, getSavingStatus, getLoadingStatus, getCourseSettings,
} from './data/selectors';
import { fetchGradingSettings, sendGradingSetting, fetchCourseSettingsQuery } from './data/thunks';
import GradingScale from './grading-scale/GradingScale';
import GradingSidebar from './grading-sidebar';
import messages from './messages';
import { getGradingValues, getSortedGrades } from './grading-scale/utils';
import AssignmentSection from './assignment-section';
import CreditSection from './credit-section';
import DeadlineSection from './deadline-section';

const GradingSettings = ({ intl, courseId }) => {
  const gradingSettingsData = useSelector(getGradingSettings);
  const courseSettingsData = useSelector(getCourseSettings);
  const courseAssignmentLists = useSelector(getCourseAssignmentLists);
  const [gradingData, setGradingData] = useState({});
  const savingStatus = useSelector(getSavingStatus);
  const loadingStatus = useSelector(getLoadingStatus);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const dispatch = useDispatch();
  const isLoading = loadingStatus === RequestStatus.IN_PROGRESS;
  const resetDataRef = useRef(false);
  const {
    gradeCutoffs = {},
    gracePeriod = { hours: '', minutes: '' },
    minimumGradeCredit,
    graders,
  } = gradingData;
  const gradeLetters = gradeCutoffs && Object.keys(gradeCutoffs);
  const gradeValues = gradeCutoffs && getGradingValues(gradeCutoffs);
  const sortedGrades = gradeCutoffs && getSortedGrades(gradeValues);
  const [isQueryPending, setIsQueryPending] = useState(false);
  const [showOverrideInternetConnectionAlert, setOverrideInternetConnectionAlert] = useState(false);
  const [eligibleGrade, setEligibleGrade] = useState(null);

  useEffect(() => {
    if (savingStatus === RequestStatus.SUCCESSFUL) {
      setShowSuccessAlert(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [savingStatus]);

  useEffect(() => {
    dispatch(fetchGradingSettings(courseId));
    dispatch(fetchCourseSettingsQuery(courseId));
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
    setIsQueryPending(true);
    setOverrideInternetConnectionAlert(true);
    setShowSavePrompt(!showSavePrompt);
  };

  const handleResetPageData = () => {
    setShowSavePrompt(!showSavePrompt);
    setGradingData(gradingSettingsData);
    resetDataRef.current = true;
    setOverrideInternetConnectionAlert(false);
  };

  const handleInternetConnectionFailed = () => {
    setShowSavePrompt(false);
    setShowSuccessAlert(false);
    setIsQueryPending(false);
    setOverrideInternetConnectionAlert(true);
  };

  const handleDispatchMethodCall = () => {
    setIsQueryPending(false);
    setShowSavePrompt(false);
    setOverrideInternetConnectionAlert(false);
  };

  const handleAddAssignment = () => {
    setGradingData(prevState => ({
      ...prevState,
      graders: [...prevState.graders, {
        id: graders.length,
        dropCount: 0,
        minCount: 1,
        shortLabel: '',
        type: '',
        weight: 0,
      }],
    }));
  };

  const handleRemoveAssignment = (id) => {
    setGradingData((prevState) => ({
      ...prevState,
      graders: prevState.graders.filter((obj) => obj.id !== id),
    }));
    setShowSavePrompt(!showSavePrompt);
  };

  return (
    <>
      <Container size="xl" className="m-4">
        <div className="mt-5">
          {showOverrideInternetConnectionAlert && (
            <InternetConnectionAlert
              isQueryPending={isQueryPending}
              dispatchMethod={sendGradingSetting(courseId, gradingData)}
              onInternetConnectionFailed={handleInternetConnectionFailed}
              onDispatchMethodCall={handleDispatchMethodCall}
            />
          )}
          <AlertMessage
            show={showSuccessAlert}
            variant="success"
            icon={CheckCircle}
            title={intl.formatMessage(messages.alertSuccess)}
            aria-hidden="true"
            aria-labelledby={intl.formatMessage(messages.alertSuccessAriaLabelledby)}
            aria-describedby={intl.formatMessage(messages.alertSuccessAriaDescribedby)}
          />
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
                  <SubHeader
                    title={intl.formatMessage(messages.headingTitle)}
                    subtitle={intl.formatMessage(messages.headingSubtitle)}
                    contentTitle={intl.formatMessage(messages.policy)}
                    description={intl.formatMessage(messages.policiesDescription)}
                  />

                  <section>
                    <GradingScale
                      gradeCutoffs={gradeCutoffs}
                      showSavePrompt={setShowSavePrompt}
                      gradeLetters={gradeLetters}
                      gradeValues={gradeValues}
                      sortedGrades={sortedGrades}
                      setShowSuccessAlert={setShowSuccessAlert}
                      setGradingData={setGradingData}
                      resetDataRef={resetDataRef}
                      setOverrideInternetConnectionAlert={setOverrideInternetConnectionAlert}
                      setEligibleGrade={setEligibleGrade}
                    />
                  </section>
                  {process.env.ENABLE_CREDIT_ELIGIBILITY === 'true' && courseSettingsData.isCreditCourse && (
                    <section>
                      <SectionSubHeader
                        title={intl.formatMessage(messages.creditEligibilitySectionTitle)}
                        description={intl.formatMessage(messages.creditEligibilitySectionDescription)}
                      />
                      <CreditSection
                        eligibleGrade={eligibleGrade}
                        setShowSavePrompt={setShowSavePrompt}
                        minimumGradeCredit={minimumGradeCredit}
                        setGradingData={setGradingData}
                      />
                    </section>
                  )}

                  <section>
                    <SectionSubHeader
                      title={intl.formatMessage(messages.gradingRulesPoliciesSectionTitle)}
                      description={intl.formatMessage(messages.gradingRulesPoliciesSectionDescription)}
                    />
                    <DeadlineSection
                      setShowSavePrompt={setShowSavePrompt}
                      gracePeriod={gracePeriod}
                      setGradingData={setGradingData}
                    />
                  </section>

                  <section>
                    <SectionSubHeader
                      title={intl.formatMessage(messages.assignmentTypeSectionTitle)}
                      description={intl.formatMessage(messages.assignmentTypeSectionDescription)}
                    />
                    <AssignmentSection
                      handleRemoveAssignment={handleRemoveAssignment}
                      setShowSavePrompt={setShowSavePrompt}
                      graders={graders}
                      setGradingData={setGradingData}
                      courseAssignmentLists={courseAssignmentLists}
                    />

                    <Button
                      variant="success"
                      iconBefore={IconAdd}
                      onClick={handleAddAssignment}
                    >
                      {intl.formatMessage(messages.addNewAssignmentTypeBtn)}
                    </Button>
                  </section>
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
              onClick={handleResetPageData}
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

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import {
  Container, Layout, Button,
} from '@edx/paragon';
import { CheckCircle, Warning, Add as IconAdd } from '@edx/paragon/icons';

import AlertMessage from '../generic/alert-message';
import { RequestStatus } from '../data/constants';
import InternetConnectionAlert from '../generic/internet-connection-alert';
import SubHeader from '../generic/sub-header/SubHeader';
import { getGradingSettings, getSavingStatus, getLoadingStatus } from './data/selectors';
import { fetchGradingSettings, sendGradingSetting } from './data/thunks';
import GradingScale from './grading-scale/GradingScale';
import GradingSidebar from './grading-sidebar';
import messages from './messages';
import { getGradingValues, getSortedGrades } from './grading-scale/utils';
import AssignmentSection from './assignment-section';
import SectionSubHeader from '../generic/section-sub-header';
import CreditSection from './credit-section';
import DeadlineSection from './deadline-section';

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
  const {
    gradeCutoffs = {}, gracePeriod = { hours: '', minutes: '' }, minimumGradeCredit,
  } = gradingData;
  const gradeLetters = gradeCutoffs && Object.keys(gradeCutoffs);
  const gradeValues = gradeCutoffs && getGradingValues(gradeCutoffs);
  const sortedGrades = gradeCutoffs && getSortedGrades(gradeValues);
  const [isQueryPending, setIsQueryPending] = useState(false);
  const [showOverrideInternetConnectionAlert, setOverrideInternetConnectionAlert] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [eligibleGrade, setEligibleGrade] = useState();
  const [state, setState] = useState({});

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
    setIsQueryPending(true);
    setOverrideInternetConnectionAlert(true);
    setShowSavePrompt(!showSavePrompt);
  };

  const handleResetPageData = () => {
    setShowSavePrompt(!showSavePrompt);
    setGradingData(gradingSettingsData);
    resetDataRef.current = true;
    setOverrideInternetConnectionAlert(false);
    setAssignments([]);
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
    setAssignments(prevState => [...prevState, prevState.length + 1]);
    // setShowSavePrompt(!showSavePrompt);
  };

  const handleRemoveAssignment = (name) => {
    const index = assignments.indexOf(name);
    if (index !== -1) {
      const updatedItems = [...assignments];
      updatedItems.splice(index, 1);
      setAssignments(updatedItems);
    }
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
                  {process.env.ENABLE_CREDIT_ELIGIBILITY === 'true' && (
                    <section>
                      <SectionSubHeader
                        title="Credit eligibility"
                        description="Deadlines, requirements, and logistics around grading student work"
                      />
                      <CreditSection
                        eligibleGrade={eligibleGrade}
                        setShowSavePrompt={setShowSavePrompt}
                        minimumGradeCredit={minimumGradeCredit}
                      />
                    </section>
                  )}

                  <section>
                    <SectionSubHeader
                      title="Grading rules & policies"
                      description="Deadlines, requirements, and logistics around grading student work"
                    />
                    <DeadlineSection
                      setShowSavePrompt={setShowSavePrompt}
                      gracePeriod={gracePeriod}
                    />
                  </section>

                  <section>
                    <SectionSubHeader
                      title="Assignment Types"
                      description="Categories and labels for any exercises that are gradable"
                    />
                    {assignments.map((assignment) => (
                      <AssignmentSection
                        key={assignment}
                        idx={assignment}
                        handleRemoveAssignment={handleRemoveAssignment}
                        state={state}
                        setState={setState}
                        setShowSavePrompt={setShowSavePrompt}
                      />
                    ))}
                    <Button
                      variant="success"
                      iconBefore={IconAdd}
                      onClick={handleAddAssignment}
                    >
                      New assignment type
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
            <Button onClick={handleSendGradingSettingsData} disabled={!state.type}>
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

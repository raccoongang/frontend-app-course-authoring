import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Button, Layout } from '@edx/paragon';
import { CheckCircle, Info, WarningFilled } from '@edx/paragon/icons';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';
import { fetchCourseAppSettings, updateCourseAppSetting, fetchProctoringExamErrors } from './data/thunks';
import { getCourseAppSettings, getSavingStatus, getProctoringExamErrors } from './data/selectors';
import SettingCard from './setting-card/SettingCard';
import SettingAlert from './setting-alert/SettingAlert';
import SettingsSidebar from '../generic/settings-sidebar/SettingsSidebar';
import { RequestStatus } from '../data/constants';
import { getPagePath, parseArrayOrObjectValues } from '../utils';
import messages from './messages';
import AlertProctoringError from '../generic/AlertProctoringError';

const AdvancedSettings = ({ intl, courseId }) => {
  const advancedSettingsData = useSelector(getCourseAppSettings);
  const savingStatus = useSelector(getSavingStatus);
  const proctoringExamErrors = useSelector(getProctoringExamErrors);
  const dispatch = useDispatch();
  const [saveSettingsPrompt, showSaveSettingsPrompt] = useState(false);
  const [showDeprecated, setShowDeprecated] = useState(false);
  const [editedSettings, setEditedSettings] = useState({});
  const { config } = useContext(AppContext);

  useEffect(() => {
    dispatch(fetchCourseAppSettings(courseId));
    dispatch(fetchProctoringExamErrors(courseId));
  }, [courseId]);

  const handleSettingChange = (e, settingName) => {
    const { value } = e.target;
    if (!saveSettingsPrompt) {
      showSaveSettingsPrompt(true);
    }
    setEditedSettings((prevEditedSettings) => ({
      ...prevEditedSettings,
      [settingName]: value || ' ',
    }));
  };

  const handleResetSettingsValues = () => {
    setEditedSettings({});
    showSaveSettingsPrompt(false);
  };

  const handleUpdateAdvancedSettingsData = () => {
    dispatch(updateCourseAppSetting(courseId, parseArrayOrObjectValues(editedSettings)));
    showSaveSettingsPrompt(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Container size="xl">
        <div className="setting-header mt-5">
          {(proctoringExamErrors?.length > 0) && (
            <AlertProctoringError
              icon={Info}
              proctoringErrorsData={proctoringExamErrors}
              aria-hidden="true"
              aria-labelledby={intl.formatMessage(messages.alertProctoringAriaLabelledby)}
              aria-describedby={intl.formatMessage(messages.alertProctoringDescribedby)}
            />
        )}
          {(savingStatus === RequestStatus.SUCCESSFUL) && (
            <SettingAlert
              variant="success"
              icon={CheckCircle}
              title={intl.formatMessage(messages.alertSuccess)}
              description={intl.formatMessage(messages.alertSuccessDescriptions)}
              aria-hidden="true"
              aria-labelledby={intl.formatMessage(messages.alertSuccessAriaLabelledby)}
              aria-describedby={intl.formatMessage(messages.alertSuccessAriaDescribedby)}
            />
          )}
          <header className="setting-header-inner">
            <h1 className="setting-header-title">
              <small className="setting-header-title-subtitle">{intl.formatMessage(messages.headingSubtitle)}</small>
              {intl.formatMessage(messages.headingTitle)}
            </h1>
          </header>
        </div>
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
                  <section className="setting-items-policies">
                    <header>
                      <h2 className="setting-items-policies-title">{intl.formatMessage(messages.policy)}</h2>
                    </header>
                    <p className="setting-items-policies-instructions mb-4">
                      <FormattedMessage
                        id="course-authoring.advanced-settings.policies.description"
                        defaultMessage="{notice} Do not modify these policies unless you are familiar with their purpose."
                        values={{ notice: <strong>Warning: </strong> }}
                      />
                    </p>
                    <div className="setting-items-deprecated-setting">
                      <Button
                        variant={showDeprecated ? 'outline-brand' : 'tertiary'}
                        onClick={() => setShowDeprecated(!showDeprecated)}
                      >
                        <FormattedMessage
                          id="course-authoring.advanced-settings.deprecated.button.text"
                          defaultMessage="{visibility} Deprecated Settings"
                          values={{
                            visibility:
                              showDeprecated ? intl.formatMessage(messages.deprecatedButtonHideText)
                                : intl.formatMessage(messages.deprecatedButtonShowText),
                          }}
                        />
                      </Button>
                    </div>
                    <ul className="setting-items-list p-0">
                      {Object.keys(advancedSettingsData).sort().map((settingName) => {
                        const settingData = advancedSettingsData[settingName];
                        return (
                          <SettingCard
                            key={settingName}
                            settingData={settingData}
                            onChange={(e) => handleSettingChange(e, settingName)}
                            showDeprecated={showDeprecated}
                            name={settingName}
                            value={editedSettings[settingName] || settingData.value}
                          />
                          );
                        })}
                    </ul>
                  </section>
                </div>
              </article>
            </Layout.Element>
            <Layout.Element>
              <SettingsSidebar
                courseId={courseId}
                title={intl.formatMessage(messages.about)}
                links={[
                  {
                    name: intl.formatMessage(messages.otherCourseSettingsLinkToScheduleAndDetails),
                    destination: getPagePath(courseId, process.env.ENABLE_NEW_SCHEDULE_DETAILS_PAGE, 'settings/details'),
                  },
                  {
                    name: intl.formatMessage(messages.otherCourseSettingsLinkToGrading),
                    destination: getPagePath(courseId, process.env.ENABLE_NEW_GRADING_PAGE, 'settings/grading'),
                  },
                  {
                    name: intl.formatMessage(messages.otherCourseSettingsLinkToCourseTeam),
                    destination: getPagePath(courseId, process.env.ENABLE_NEW_COURSE_TEAM_PAGE, 'course_team'),
                  },
                  {
                    name: intl.formatMessage(messages.otherCourseSettingsLinkToGroupConfigurations),
                    destination: `${config.STUDIO_BASE_URL}/group_configurations/${courseId}`,
                  },
                ]}
              >
                <p className="setting-sidebar-supplementary-about-descriptions">
                  {intl.formatMessage(messages.aboutDescription1)}
                </p>
                <p className="setting-sidebar-supplementary-about-descriptions">
                  {intl.formatMessage(messages.aboutDescription2)}
                </p>
                <p className="setting-sidebar-supplementary-about-descriptions">
                  <FormattedMessage
                    id="course-authoring.advanced-settings.about.description-3"
                    defaultMessage="{notice} When you enter strings as policy values, ensure that you use double quotation marks (“) around the string. Do not use single quotation marks (‘)."
                    values={{ notice: <strong>Note:</strong> }}
                  />
                </p>
              </SettingsSidebar>
            </Layout.Element>
          </Layout>
        </section>
      </Container>
      <div className="alert-toast">
        <SettingAlert
          show={saveSettingsPrompt}
          aria-hidden={saveSettingsPrompt}
          aria-labelledby={intl.formatMessage(messages.alertWarningAriaLabelledby)}
          aria-describedby={intl.formatMessage(messages.alertWarningAriaDescribedby)}
          role="dialog"
          actions={[
            <Button onClick={handleUpdateAdvancedSettingsData}>
              {intl.formatMessage(messages.buttonSaveText)}
            </Button>,
            <Button variant="tertiary" onClick={handleResetSettingsValues}>
              {intl.formatMessage(messages.buttonCancelText)}
            </Button>,
          ]}
          variant="warning"
          icon={WarningFilled}
          title={intl.formatMessage(messages.alertWarning)}
          description={intl.formatMessage(messages.alertWarningDescriptions)}
        />
      </div>
    </>
  );
};

AdvancedSettings.propTypes = {
  intl: intlShape.isRequired,
  courseId: PropTypes.string.isRequired,
};

export default injectIntl(AdvancedSettings);

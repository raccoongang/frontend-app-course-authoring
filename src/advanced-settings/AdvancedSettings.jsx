import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Button,
  Layout,
  useToggle,
} from '@edx/paragon';
import {
  CheckCircle, Info, WarningFilled,
} from '@edx/paragon/icons';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { fetchCourseAppSettings, updateCourseAppSetting, getProctoredExamsErrors } from './data/thunks';
import SettingCard from './setting-card/SettingCard';
import SettingAlert from './setting-alert/SettingAlert';
import SettingsSidebar from './settings-sidebar/SettingsSidebar';
import AdvancedSettingsProvider from './AdvancedSettingsProvider';
import { RequestStatus } from '../data/constants';
import messages from './messages';

const AdvancedSettings = ({ intl, courseId }) => {
  const advancedSettingsData = useSelector(state => state.advancedSettings.courseAppSettings);
  const savingStatus = useSelector(state => state.advancedSettings.savingStatus);
  const proctoredErrors = useSelector(state => state.advancedSettings.proctoredErrors.proctoredErrors);
  const dispatch = useDispatch();
  const [showWarningAlert, setShowWarningAlert] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isOn, setOn, setOff, toggle] = useToggle(false);
  const [settingValues, setSettingValues] = useState({});

  useEffect(() => {
    dispatch(fetchCourseAppSettings(courseId));
    dispatch(getProctoredExamsErrors(courseId));
  }, [courseId]);

  const handleSettingChange = (e, name) => {
    const { value } = e.target;
    if (!value) {
      return setSettingValues((prevInputValues) => ({
        ...prevInputValues,
        [name]: ' ',
      }));
    }
    if (!showWarningAlert) {
      setShowWarningAlert(true);
    }
    return setSettingValues((prevInputValues) => ({
      ...prevInputValues,
      [name]: value,
    }));
  };

  // function processValue(obj) {
  //   Object.entries(obj).forEach(([key, value]) => {
  //     try {
  //       const parsedValue = JSON.parse(value);
  //       if (Array.isArray(parsedValue) || typeof parsedValue === 'object') {
  //         obj[key] = parsedValue;
  //       } else {
  //         throw new Error(`Invalid JSON value for property ${key}`);
  //       }
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //   });
  // }
  function processValue(obj) {
    const result = {};

    Object.entries(obj).forEach(([key, value]) => {
      try {
        const parsedValue = JSON.parse(value);
        if (Array.isArray(parsedValue) || typeof parsedValue === 'object') {
          result[key] = parsedValue;
        } else {
          throw new Error(`Invalid JSON value for property ${key}`);
        }
      } catch (error) {}
    });

    return result;
  }

  const handleResetSettingsValues = () => {
    setSettingValues({});
    setShowWarningAlert(false);
  };

  const handleUpdateAdvancedSettingsData = () => {
    setShowWarningAlert(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    dispatch(updateCourseAppSetting(courseId, processValue(settingValues)));
  };

  return (
    <AdvancedSettingsProvider courseId={courseId}>
      <Container size="xl">
        <div className="setting-header mt-5">
          {(savingStatus === RequestStatus.FAILED) && (
          <SettingAlert
            variant="danger"
            icon={Info}
            data={proctoredErrors}
            title={intl.formatMessage(messages.alertDanger)}
            description={intl.formatMessage(messages.alertDangerDescriptions)}
            aria-hidden={savingStatus === RequestStatus.FAILED ? 'true' : 'false'}
            aria-labelledby={intl.formatMessage(messages.alertDangerAriaLabelledby)}
            aria-describedby={intl.formatMessage(messages.alertDangerAriaDescribedby)}
          />
          )}
          {(savingStatus === RequestStatus.SUCCESSFUL) && (
            <SettingAlert
              variant="success"
              icon={CheckCircle}
              title={intl.formatMessage(messages.alertSuccess)}
              description={intl.formatMessage(messages.alertSuccessDescriptions)}
              aria-hidden={savingStatus === RequestStatus.SUCCESSFUL ? 'true' : 'false'}
              aria-labelledby={intl.formatMessage(messages.alertSuccessAriaLabelledby)}
              aria-describedby={intl.formatMessage(messages.alertSuccessAriaDescribedby)}
            />
            )}
          <header className="setting-header-inner">
            <h1 className="setting-header__title">
              <small className="setting-header__title-subtitle">{intl.formatMessage(messages.headingSubtitle)}</small>
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
                  <section className="setting-items__policies">
                    <header>
                      <h2 className="setting-items__policies-title">{intl.formatMessage(messages.policy)}</h2>
                    </header>
                    <p className="setting-items__policies-instructions mb-4">
                      <FormattedMessage
                        id="course-authoring.advanced-settings.policies.description"
                        defaultMessage="{notice} Do not modify these policies unless you are familiar with their purpose."
                        values={{ notice: <strong>Warning: </strong> }}
                      />
                    </p>
                    <div className="setting-items__deprecated-setting">
                      <Button onClick={toggle}>
                        <FormattedMessage
                          id="course-authoring.advanced-settings.deprecated.button.text"
                          defaultMessage="{visibility} Deprecated Settings"
                          values={{
                                visibility:
                                    isOn ? intl.formatMessage(messages.deprecatedButtonHideText)
                                        : intl.formatMessage(messages.deprecatedButtonShowText),
                              }}
                        />
                      </Button>
                    </div>
                    <ul className="setting-items__list p-0">
                      {Object.keys(advancedSettingsData).sort().map((settingName) => {
                        const settingData = advancedSettingsData[settingName];
                        return (
                          <SettingCard
                            key={settingName}
                            settingData={settingData}
                            onChange={(e) => handleSettingChange(e, settingName)}
                            isOn={isOn}
                            name={settingName}
                            value={settingValues[settingName] || settingData.value}
                          />
                          );
                        })}
                    </ul>
                  </section>
                </div>
              </article>
            </Layout.Element>
            <Layout.Element>
              <SettingsSidebar courseId={courseId} />
            </Layout.Element>
          </Layout>
        </section>
      </Container>

      <div className="alert-toast">
        <SettingAlert
          show={showWarningAlert}
          aria-hidden={showWarningAlert}
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
    </AdvancedSettingsProvider>
  );
};

AdvancedSettings.propTypes = {
  intl: intlShape.isRequired,
  courseId: PropTypes.string.isRequired,
};

export default injectIntl(AdvancedSettings);

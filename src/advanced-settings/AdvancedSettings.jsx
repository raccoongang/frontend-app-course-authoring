import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import {
  Container, Button, Layout, AlertModal, ActionRow, Icon, Alert,
} from '@edx/paragon';
import {
 CheckCircle, Info, WarningFilled, Error,
} from '@edx/paragon/icons';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { fetchCourseAppSettings, updateCourseAppSetting, fetchProctoringExamErrors } from './data/thunks';
import {
  getCourseAppSettings, getSavingStatus, getProctoringExamErrors, getSendRequestErrors,
} from './data/selectors';
import SettingCard from './setting-card/SettingCard';
import SettingAlert from './setting-alert/SettingAlert';
import SettingsSidebar from './settings-sidebar/SettingsSidebar';
import { RequestStatus } from '../data/constants';
import { parseArrayOrObjectValues } from '../utils';
import messages from './messages';
import AlertProctoringError from '../generic/AlertProctoringError';

const AdvancedSettings = ({ intl, courseId }) => {
  const advancedSettingsData = useSelector(getCourseAppSettings);
  const savingStatus = useSelector(getSavingStatus);
  const proctoringExamErrors = useSelector(getProctoringExamErrors);
  const settingsWithSendErrors = useSelector(getSendRequestErrors) || {};
  const dispatch = useDispatch();
  const [saveSettingsPrompt, showSaveSettingsPrompt] = useState(false);
  const [showDeprecated, setShowDeprecated] = useState(false);
  const [errorModal, showErrorModal] = useState(false);
  const [editedSettings, setEditedSettings] = useState({});
  const [errorFields, setErrorFields] = useState([]);
  const [successAlert, showSuccessAlert] = useState(false);

  useEffect(() => {
    dispatch(fetchCourseAppSettings(courseId));
    dispatch(fetchProctoringExamErrors(courseId));

    switch (savingStatus) {
      case RequestStatus.SUCCESSFUL:
        showSuccessAlert(true);
        break;
      case RequestStatus.FAILED:
        settingsWithSendErrors.forEach(error => {
          setErrorFields(prevState => [...prevState, error]);
        });
        showErrorModal(true);
        break;
      default:
        break;
    }
  }, [courseId, savingStatus, editedSettings]);

  const handleSettingChange = (e, settingName) => {
    const { value } = e.target;
    if (!saveSettingsPrompt) {
      showSaveSettingsPrompt(true);
    }
    setEditedSettings((prevEditedSettings) => ({
      ...prevEditedSettings,
      [settingName]: value.replace(/^["'](.+(?=["']$))["']$/, '$1') || ' ',
    }));
  };

  const handleResetSettingsValues = () => {
    showErrorModal(!errorModal);
    setEditedSettings({});
    showSaveSettingsPrompt(false);
  };

  const schema = Yup.object().test('isValid', 'Wrong format', object => {
    const fieldsWithErrors = [];

    Object.entries(object).forEach(([settingName, settingValue]) => {
      if (typeof settingValue === 'string') {
        if (settingValue.startsWith('[') && settingValue.endsWith(']')) {
          try {
            JSON.parse(settingValue);
          } catch (err) {
            fieldsWithErrors.push({ key: settingName, message: 'Incorrectly formatted JSON 1' });
          }
        } else if (settingValue.startsWith('{') && settingValue.endsWith('}')) {
          try {
            JSON.parse(settingValue);
          } catch (err) {
            fieldsWithErrors.push({ key: settingName, message: 'Incorrectly formatted JSON 2' });
          }
        } else if (!settingValue.includes('{') && !settingValue.includes('[') && !settingValue.includes('}') && !settingValue.includes(']')) {
          // Do nothing
        } else {
          fieldsWithErrors.push({ key: settingName, message: 'Incorrectly formatted JSON 3' });
        }
      }
    });

    setErrorFields(prevState => {
      if (JSON.stringify(prevState) !== JSON.stringify(fieldsWithErrors)) {
        return fieldsWithErrors;
      }
      return prevState;
    });

    return fieldsWithErrors.length === 0;
  });

  const handleUpdateAdvancedSettingsData = () => {
    schema
        .validate(editedSettings)
        .then(() => {
          dispatch(updateCourseAppSetting(courseId, parseArrayOrObjectValues(editedSettings)));
          window.scrollTo({ top: 0, behavior: 'smooth' });
          showSaveSettingsPrompt(!saveSettingsPrompt);
        })
        .catch(error => {
          if (process.env.NODE_ENV === 'development') {
            console.log(error); // eslint-disable-line no-console
          }
          showErrorModal(!errorModal);
        });
  };

  return (
    <>
      <Container size="xl">
        <div className="setting-header mt-5">
          <AlertProctoringError
            show={proctoringExamErrors?.length > 0}
            icon={Info}
            proctoringErrorsData={proctoringExamErrors ?? []}
            aria-hidden="true"
            aria-labelledby={intl.formatMessage(messages.alertProctoringAriaLabelledby)}
            aria-describedby={intl.formatMessage(messages.alertProctoringDescribedby)}
          />
          <SettingAlert
            show={successAlert}
            variant="success"
            icon={CheckCircle}
            title={intl.formatMessage(messages.alertSuccess)}
            description={intl.formatMessage(messages.alertSuccessDescriptions)}
            aria-hidden="true"
            aria-labelledby={intl.formatMessage(messages.alertSuccessAriaLabelledby)}
            aria-describedby={intl.formatMessage(messages.alertSuccessAriaDescribedby)}
          />
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
              <SettingsSidebar courseId={courseId} />
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
      <AlertModal
        title={intl.formatMessage(messages.modalErrorTitle)}
        isOpen={errorModal}
        variant="danger"
        footerNode={(
          <ActionRow>
            <Button onClick={handleResetSettingsValues}>
              {intl.formatMessage(messages.modalErrorButtonUndoChanges)}
            </Button>
            <Button
              variant="tertiary"
              onClick={() => showErrorModal(!errorModal)}
            >
              {intl.formatMessage(messages.modalErrorButtonChangeManually)}
            </Button>
          </ActionRow>
          )}
      >
        <p>
          <FormattedMessage
            id="course-authoring.advanced-settings.modal.error.description"
            defaultMessage="There was {errorCounter} while trying to save the course settings in the database.
            Please check the following validation feedbacks and reflect them in your course settings:"
            values={{ errorCounter: <strong>{errorFields.length} validation error </strong> }}
          />
        </p>
        <hr />
        <ul className="p-0">
          {errorFields.map((settingName) => {
            const outputString = settingName.key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
            const { displayName } = advancedSettingsData[outputString];
            return (
              <li key={displayName} className="modal-error-item">
                <Alert variant="danger">
                  <h4><Icon src={Error} />{displayName}:</h4>
                  <p className="m-0">{settingName.message}</p>
                </Alert>
              </li>
            );
          })}
        </ul>
      </AlertModal>
    </>
  );
};

AdvancedSettings.propTypes = {
  intl: intlShape.isRequired,
  courseId: PropTypes.string.isRequired,
};

export default injectIntl(AdvancedSettings);

import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  headingTitle: {
    id: 'course-authoring.advanced-settings.heading.title',
    defaultMessage: 'Advanced settings',
  },
  headingSubtitle: {
    id: 'course-authoring.advanced-settings.heading.subtitle',
    defaultMessage: 'Settings',
  },
  policy: {
    id: 'course-authoring.advanced-settings.policies.title',
    defaultMessage: 'Manual Policy Definition',
  },
  alertWarning: {
    id: 'course-authoring.advanced-settings.alert.warning',
    defaultMessage: 'You`ve made some changes',
  },
  alertWarningDescriptions: {
    id: 'course-authoring.advanced-settings.alert.warning.descriptions',
    defaultMessage: 'Your changes will not take effect until you save your progress. Take care with key and value formatting, as validation is not implemented.',
  },
  alertSuccess: {
    id: 'course-authoring.advanced-settings.alert.success',
    defaultMessage: 'Your policy changes have been saved.',
  },
  alertSuccessDescriptions: {
    id: 'course-authoring.advanced-settings.alert.success.descriptions',
    defaultMessage: 'No validation is performed on policy keys or value pairs. If you are having difficulties, check your formatting.',
  },
  alertProctoringError: {
    id: 'course-authoring.advanced-settings.alert.proctoring.error',
    defaultMessage: 'This course has protected exam setting that are incomplete or invalid.',
  },
  alertProctoringErrorDescriptions: {
    id: 'course-authoring.advanced-settings.alert.proctoring.error.descriptions',
    defaultMessage: 'You will be unable to make changes until the following setting are updated on the page below.',
  },
  buttonSaveText: {
    id: 'course-authoring.advanced-settings.alert.button.save',
    defaultMessage: 'Save Changes',
  },
  buttonCancelText: {
    id: 'course-authoring.advanced-settings.alert.button.cancel',
    defaultMessage: 'Cancel',
  },
  deprecatedButtonShowText: {
    id: 'course-authoring.advanced-settings.deprecated.button.show',
    defaultMessage: 'Show',
  },
  deprecatedButtonHideText: {
    id: 'course-authoring.advanced-settings.deprecated.button.hide',
    defaultMessage: 'Hide',
  },
  alertWarningAriaLabelledby: {
    id: 'course-authoring.advanced-settings.alert.warning.aria.labelledby',
    defaultMessage: 'notification-warning-title',
  },
  alertWarningAriaDescribedby: {
    id: 'course-authoring.advanced-settings.alert.warning.aria.describedby',
    defaultMessage: 'notification-warning-description',
  },
  alertSuccessAriaLabelledby: {
    id: 'course-authoring.advanced-settings.alert.success.aria.labelledby',
    defaultMessage: 'alert-confirmation-title',
  },
  alertSuccessAriaDescribedby: {
    id: 'course-authoring.advanced-settings.alert.success.aria.describedby',
    defaultMessage: 'alert-confirmation-description',
  },
  alertProctoringAriaLabelledby: {
    id: 'course-authoring.advanced-settings.alert.proctoring.error.aria.labelledby',
    defaultMessage: 'alert-danger-title',
  },
  alertProctoringDescribedby: {
    id: 'course-authoring.advanced-settings.alert.proctoring.error.aria.describedby',
    defaultMessage: 'alert-danger-description',
  },
  about: {
    id: 'course-authoring.advanced-settings.sidebar.about.title',
    defaultMessage: 'What do advanced settings do?',
  },
  aboutDescription1: {
    id: 'course-authoring.advanced-settings.sidebar.about.description-1',
    defaultMessage: 'Advanced settings control specific course functionality. On this page, you can edit manual policies, which are JSON-based key and value pairs that control specific course settings.',
  },
  aboutDescription2: {
    id: 'course-authoring.advanced-settings.sidebar.about.description-2',
    defaultMessage: 'Any policies you modify here override all other information you’ve defined elsewhere in Studio. Do not edit policies unless you are familiar with both their purpose and syntax.',
  },
  other: {
    id: 'course-authoring.advanced-settings.sidebar.other.title',
    defaultMessage: 'Other Course Settings',
  },
  otherCourseSettingsLinkToScheduleAndDetails: {
    id: 'course-authoring.advanced-settings.sidebar.links.schedule-and-details',
    defaultMessage: 'Schedule & Details',
    description: 'Link to Studio Schedule & Details page',
  },
  otherCourseSettingsLinkToGrading: {
    id: 'course-authoring.advanced-settings.sidebar.links.grading',
    defaultMessage: 'Grading',
    description: 'Link to Studio Grading page',
  },
  otherCourseSettingsLinkToCourseTeam: {
    id: 'course-authoring.advanced-settings.sidebar.links.course-team',
    defaultMessage: 'Course Team',
    description: 'Link to Studio Course Team page',
  },
  otherCourseSettingsLinkToGroupConfigurations: {
    id: 'course-authoring.advanced-settings.sidebar.links.group-configurations',
    defaultMessage: 'Group Configurations',
    description: 'Link to Studio Group Configurations page',
  },
});

export default messages;

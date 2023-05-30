import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
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
  otherCourseSettingsLink1: {
    id: 'course-authoring.advanced-settings.sidebar.links.link-1',
    defaultMessage: 'Schedule & Details',
    description: 'Link to Studio Schedule & Details page',
  },
  otherCourseSettingsLink2: {
    id: 'course-authoring.advanced-settings.sidebar.links.link-2',
    defaultMessage: 'Grading',
    description: 'Link to Studio Grading page',
  },
  otherCourseSettingsLink3: {
    id: 'course-authoring.advanced-settings.sidebar.links.link-3',
    defaultMessage: 'Course Team',
    description: 'Link to Studio Course Team page',
  },
  otherCourseSettingsLink4: {
    id: 'course-authoring.advanced-settings.sidebar.links.link-4',
    defaultMessage: 'Group Configurations',
    description: 'Link to Studio Group Configurations page',
  },
});

export default messages;

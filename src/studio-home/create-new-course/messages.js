import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  createNewCourse: {
    id: 'course-authoring.studio-home.new-course.title',
    defaultMessage: 'Create a new course',
  },
  courseDisplayNameLabel: {
    id: 'course-authoring.studio-home.new-course.display-name.label',
    defaultMessage: 'Course name',
  },
  courseDisplayNamePlaceholder: {
    id: 'course-authoring.studio-home.new-course.display-name.placeholder',
    defaultMessage: 'e.g. Introduction to Computer Science',
  },
  courseDisplayNameHelpText: {
    id: 'course-authoring.studio-home.new-course.display-name.help-text',
    defaultMessage: 'The public display name for your course. This cannot be changed but you can set a different display name in advanced settings later.',
  },
  courseOrgLabel: {
    id: 'course-authoring.studio-home.new-course.org.label',
    defaultMessage: 'Organization',
  },
  courseOrgPlaceholder: {
    id: 'course-authoring.studio-home.new-course.org.placeholder',
    defaultMessage: 'e.g. UniversityX or OrganizationX',
  },
  courseOrgHelpText: {
    id: 'course-authoring.studio-home.new-course.org.help-text',
    defaultMessage: 'The name of the organization sponsoring the course. {strong}',
  },
  courseOrgHelpTextStrong: {
    id: 'course-authoring.studio-home..new-course.org.help-text.strong',
    defaultMessage: 'Note: The organization name is part of the course URL.',
  },
  courseNumberLabel: {
    id: 'course-authoring.studio-home..new-course.number.label',
    defaultMessage: 'Course number',
  },
  courseNumberPlaceholder: {
    id: 'course-authoring.studio-home..new-course.number.placeholder',
    defaultMessage: 'e.g. CS101',
  },
  courseNumberHelpText: {
    id: 'course-authoring.studio-home.new-course.number.help-text',
    defaultMessage: 'The unique number that identifies your course within your organization. {strong}',
  },
  courseNumberHelpTextStrong: {
    id: 'course-authoring.studio-home.new-course.number.help-text.strong',
    defaultMessage: 'Note: This is part of your course URL, so no spaces or special characters are allowed and it cannot be changed.',
  },
  courseRunLabel: {
    id: 'course-authoring.studio-home.new-course.run.label',
    defaultMessage: 'Course run',
  },
  courseRunPlaceholder: {
    id: 'course-authoring.studio-home.new-course.run.placeholder',
    defaultMessage: 'e.g. 2014_T1',
  },
  courseRunHelpText: {
    id: 'course-authoring.studio-home.new-course.run.help-text',
    defaultMessage: 'The term in which your course will run.',
  },
  defaultPlaceholder: {
    id: 'course-authoring.studio-home.new-course.default-placeholder',
    defaultMessage: 'Label',
  },
  createButton: {
    id: 'course-authoring.studio-home.new-course.button.create',
    defaultMessage: 'Create',
  },
  creatingButton: {
    id: 'course-authoring.studio-home.new-course.button.creating',
    defaultMessage: 'Creating',
  },
  cancelButton: {
    id: 'course-authoring.studio-home.new-course.button.cancel',
    defaultMessage: 'Cancel',
  },
  requiredFieldError: {
    id: 'course-authoring.studio-home.new-course.required.error',
    defaultMessage: 'Required field.',
  },
  disallowedCharsError: {
    id: 'course-authoring.studio-home.new-course.disallowed-chars.error',
    defaultMessage: 'Please do not use any spaces or special characters in this field.',
  },
  noSpaceError: {
    id: 'course-authoring.studio-home.new-course.no-space.error',
    defaultMessage: 'Please do not use any spaces in this field.',
  },
  alertErrorExistsAriaLabelledBy: {
    id: 'course-authoring.studio-home.new-course.error.already-exists.labelledBy',
    defaultMessage: 'alert-already-exists-title',
  },
  alertErrorExistsAriaDescribedBy: {
    id: 'course-authoring.studio-home.new-course.error.already-exists.aria.describedBy',
    defaultMessage: 'alert-confirmation-description',
  },
});

export default messages;

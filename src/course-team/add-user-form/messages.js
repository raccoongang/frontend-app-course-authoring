import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  formTitle: {
    id: 'course-authoring.course-team.form.title',
    defaultMessage: 'Add a User to Your Course\'s Team',
  },
  formLabel: {
    id: 'course-authoring.course-team.form.label',
    defaultMessage: 'User\'s Email Address',
  },
  formPlaceholder: {
    id: 'course-authoring.course-team.form.placeholder',
    defaultMessage: 'example: username@domain.com',
  },
  formHelperText: {
    id: 'course-authoring.course-team.form.helperText',
    defaultMessage: 'Provide the email address of the user you want to add as Staff',
  },
  addUserButton: {
    id: 'course-authoring.course-team.form.button.addUser',
    defaultMessage: 'Add user',
  },
  cancelButton: {
    id: 'course-authoring.course-team.form.button.cancel',
    defaultMessage: 'Cancel',
  },

});

export default messages;

import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  headingTitle: {
    id: 'course-authoring.course-updates.header.title',
    defaultMessage: 'Course Updates',
  },
  headingSubtitle: {
    id: 'course-authoring.course-updates.header.subtitle',
    defaultMessage: 'Content',
  },
  sectionInfo: {
    id: 'course-authoring.course-updates.section-info',
    defaultMessage: 'Use course updates to notify students of important dates or exams, highlight particular discussions in the forums, announce schedule changes, and respond to student questions. You add or edit updates in HTML.',
  },
  handoutsTitle: {
    id: 'course-authoring.course-updates.handouts.title',
    defaultMessage: 'Course Handouts',
  },
  buttons: {
    edit: {
      id: 'course-authoring.course-updates.actions.edit',
      defaultMessage: 'Edit',
    },
    delete: {
      id: 'course-authoring.course-updates.actions.delete',
      defaultMessage: 'Delete',
    },
    save: {
      id: 'course-authoring.course-updates.actions.save',
      defaultMessage: 'Save',
    },
    post: {
      id: 'course-authoring.course-updates.actions.post',
      defaultMessage: 'Post',
    },
    cancel: {
      id: 'course-authoring.course-updates.actions.cancel',
      defaultMessage: 'Cancel',
    },
    newUpdate: {
      id: 'course-authoring.course-updates.actions.new-update',
      defaultMessage: 'New Update',
    },
    ok: {
      id: 'course-authoring.course-updates.button.ok',
      defaultMessage: 'Ok',
    },
  },
  dateInvalidText: {
    id: 'course-authoring.course-updates.date-invalid',
    defineMessage: 'Action required: Enter a valid date.',
  },
  deleteModal: {
    title: {
      id: 'course-authoring.course-updates.delete-modal.title',
      defaultMessage: 'Are you sure you want to delete this update?',
    },
    description: {
      id: 'course-authoring.course-updates.delete-modal.description',
      defaultMessage: 'This action cannot be undone.',
    },
  },
  updateModal: {
    date: {
      id: 'course-authoring.course-updates.update-modal.date',
      defaultMessage: 'Date:',
    },
    inValid: {
      id: 'Action required: Enter a valid date.',
      defaultMessage: 'Action required: Enter a valid date.',
    },
    calendarAltText: {
      id: 'course-authoring.course-updates.update-modal.calendar-alt-text',
      defaultMessage: 'Calendar for datepicker input',
    },
    errorAltText: {
      id: 'course-authoring.course-updates.update-modal.error-alt-text',
      defaultMessage: 'Error icon',
    },
    addNewUpdateTitle: {
      id: 'course-authoring.course-updates.update-modal.new-update-title',
      defaultMessage: 'Add new update',
    },
    editUpdateTitle: {
      id: 'course-authoring.course-updates.update-modal.edit-update-title',
      defaultMessage: 'Edit updates',
    },
    editHandoutsTitle: {
      id: 'course-authoring.course-updates.update-modal.edit-handouts-title',
      defaultMessage: 'Edit handouts',
    },
  },
});

export default messages;

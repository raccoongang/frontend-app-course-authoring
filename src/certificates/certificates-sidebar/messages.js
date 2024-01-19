import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  about: {
    id: 'course-authoring.certificates.sidebar.about.title',
    defaultMessage: 'Working with Certificates',
  },
  aboutDescription_1: {
    id: 'course-authoring.certificates.sidebar.about.description-1',
    defaultMessage: 'Specify a course title to use on the certificate if the course\'s official title is too long to be displayed well.',
  },
  aboutDescription_2: {
    id: 'course-authoring.certificates.sidebar.about.description-2',
    defaultMessage: 'For verified certificates, specify between one and four signatories and upload the associated images. To edit or delete a certificate before it is activated, hover over the top right corner of the form and select {strongText} or the delete icon.',
  },
  aboutDescription_2_strong: {
    id: 'course-authoring.certificates.sidebar.about.description-2.strong',
    defaultMessage: 'Edit',
  },
  aboutDescription_3: {
    id: 'course-authoring.certificates.sidebar.about.description-3',
    defaultMessage: 'To view a sample certificate, choose a course mode and select {strongText}.',
  },
  aboutDescription_3_strong: {
    id: 'course-authoring.certificates.sidebar.about.description-3.strong',
    defaultMessage: 'Preview Certificate',
  },
  about_2: {
    id: 'course-authoring.certificates.sidebar.about2.title',
    defaultMessage: 'Issuing Certificates to Learners',
  },
  about_2_Description_1: {
    id: 'course-authoring.certificates.sidebar.about2.description-1',
    defaultMessage: 'To begin issuing course certificates, a course team member with either the Staff or Admin role selects {strongText}. Only course team members with these roles can edit or delete an activated certificate.',
  },
  about_2_Description_1_strong: {
    id: 'course-authoring.certificates.sidebar.about2.description-1',
    defaultMessage: 'Activate',
  },
  about_2_Description_2: {
    id: 'course-authoring.certificates.sidebar.about2.description-2',
    defaultMessage: '{strongText} delete certificates after a course has started; learners who have already earned certificates will no longer be able to access them.',
  },
  about_2_Description_2_strong: {
    id: 'course-authoring.certificates.sidebar.about2.description-2',
    defaultMessage: 'Do not',
  },
  learnMoreBtn: {
    id: 'course-authoring.certificates.sidebar.learnmore.button',
    defaultMessage: 'Learn more about certificates',
  },
});

export default messages;

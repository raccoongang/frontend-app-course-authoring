import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  cardCreate: {
    id: 'course-authoring.certificates.card.create',
    defaultMessage: 'Create',
  },
  cardCancel: {
    id: 'course-authoring.certificates.card.cancel',
    defaultMessage: 'Cancel',
  },
  detailsSectionTitle: {
    id: 'course-authoring.certificates.details.section.title',
    defaultMessage: 'Certificate details',
  },
  detailsCourseTitle: {
    id: 'course-authoring.certificates.details.course.title',
    defaultMessage: 'Course title',
  },
  detailsCourseTitleOverride: {
    id: 'course-authoring.certificates.details.course.title.override',
    defaultMessage: 'Course title override',
  },
  detailsCourseTitleOverrideDescription: {
    id: 'course-authoring.certificates.details.course.title.override.description',
    defaultMessage: 'Specify an alternative to the official course title to display on certificates. Leave blank to use the official course title.',
  },
  detailsCourseNumber: {
    id: 'course-authoring.certificates.details.course.number',
    defaultMessage: 'Course number',
  },
  detailsCourseNumberOverride: {
    id: 'course-authoring.certificates.details.course.number.override',
    defaultMessage: 'Course number override',
  },
  signatoryTitle: {
    id: 'course-authoring.certificates.signatories.title',
    defaultMessage: 'Signatory',
  },
  signatoriesRecommendation: {
    id: 'course-authoring.certificates.signatories.recommendation',
    defaultMessage: 'It is strongly recommended that you include four or fewer signatories. If you include additional signatories, preview the certificate in Print View to ensure the certificate will print correctly on one page.',
  },
  signatoriesSectionTitle: {
    id: 'course-authoring.certificates.signatories.section.title',
    defaultMessage: 'Certificate signatories',
  },
  addSignatoryButton: {
    id: 'course-authoring.certificates.signatories.add.signatory.button',
    defaultMessage: 'Add additional signatory',
  },
  addSignatoryButtonDescription: {
    id: 'course-authoring.certificates.signatories.add.signatory.button.description',
    defaultMessage: '(Add signatories for a certificate)',
  },
  editTooltip: {
    id: 'course-authoring.certificates.signatories.edit.tooltip',
    defaultMessage: 'Edit',
  },
  deleteTooltip: {
    id: 'course-authoring.certificates.signatories.delete.tooltip',
    defaultMessage: 'Delete',
  },
  nameLabel: {
    id: 'course-authoring.certificates.signatories.name.label',
    defaultMessage: 'Name:',
  },
  namePlaceholder: {
    id: 'course-authoring.certificates.signatories.name.placeholder',
    defaultMessage: 'Name of the signatory',
  },
  nameDescription: {
    id: 'course-authoring.certificates.signatories.name.description',
    defaultMessage: 'The name of this signatory as it should appear on certificates.',
  },
  titleLabel: {
    id: 'course-authoring.certificates.signatories.title.label',
    defaultMessage: 'Title:',
  },
  titlePlaceholder: {
    id: 'course-authoring.certificates.signatories.title.placeholder',
    defaultMessage: 'Title of the signatory',
  },
  titleDescription: {
    id: 'course-authoring.certificates.signatories.title.description',
    defaultMessage: 'Titles more than 100 characters may prevent students from printing their certificate on a single page.',
  },
  organizationLabel: {
    id: 'course-authoring.certificates.signatories.organization.label',
    defaultMessage: 'Organization:',
  },
  organizationPlaceholder: {
    id: 'course-authoring.certificates.signatories.organization.placeholder',
    defaultMessage: 'Organization of the signatory',
  },
  organizationDescription: {
    id: 'course-authoring.certificates.signatories.organization.description',
    defaultMessage: 'The organization that this signatory belongs to, as it should appear on certificates.',
  },
  imageLabel: {
    id: 'course-authoring.certificates.signatories.image.label',
    defaultMessage: 'Signature image',
  },
  imagePlaceholder: {
    id: 'course-authoring.certificates.signatories.image.placeholder',
    defaultMessage: 'Path to signature image',
  },
  imageDescription: {
    id: 'course-authoring.certificates.signatories.image.description',
    defaultMessage: 'Image must be in PNG format',
  },
  uploadImageButton: {
    id: 'course-authoring.certificates.signatories.upload.image.button',
    defaultMessage: 'Upload signature image',
  },
  cancelModal: {
    id: 'course-authoring.certificates.signatories.cancel.modal',
    defaultMessage: 'Cancel',
  },
  uploadModal: {
    id: 'course-authoring.certificates.signatories.upload.modal',
    defaultMessage: 'Upload',
  },
  deleteSignatoryConfirmation: {
    id: 'course-authoring.certificates.signatories.confirm-modal',
    defaultMessage: 'Delete "{name}" from the list of signatories?',
  },
  deleteSignatoryConfirmationMessage: {
    id: 'course-authoring.certificates.signatories.confirm-modal.message',
    defaultMessage: 'This action cannot be undone.',
  },
  deleteCertificateConfirmation: {
    id: 'course-authoring.certificates.details.confirm-modal',
    defaultMessage: 'Delete this certificate?',
  },
  deleteCertificateMessage: {
    id: 'course-authoring.certificates.details.confirm-modal.message',
    defaultMessage: 'Deleting this certificate is permanent and cannot be undone.',
  },
});

export default messages;

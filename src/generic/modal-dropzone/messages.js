import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  uploadImageDropzoneText: {
    id: 'course-authoring.certificates.modal-dropzone.text',
    defaultMessage: 'Drag and drop your image here or click to upload',
  },
  uploadImageDropzoneAlt: {
    id: 'course-authoring.certificates.modal-dropzone.dropzone-alt',
    defaultMessage: 'Uploaded image for course certificate',
  },
  uploadImageHelpText: {
    id: 'course-authoring.certificates.modal-dropzone.help-text',
    defaultMessage: 'Image must be in png format',
  },
  uploadImageValidationText: {
    id: 'course-authoring.certificates.modal-dropzone.validation.text',
    defaultMessage: 'Only PNG files can be uploaded. Please select a file ending in .png to upload.',
  },
  uploadImageButton: {
    id: 'course-authoring.certificates.modal-dropzone.image.button',
    defaultMessage: 'Upload signature image',
  },
  cancelModal: {
    id: 'course-authoring.certificates.modal-dropzone.cancel.modal',
    defaultMessage: 'Cancel',
  },
  uploadModal: {
    id: 'course-authoring.certificates.modal-dropzone.upload.modal',
    defaultMessage: 'Upload',
  },
});

export default messages;

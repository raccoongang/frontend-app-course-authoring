import * as Yup from 'yup';
import { REQUEST_TYPES } from '../constants';
import messages from './messages';

const geUpdateModalSettings = (requestType, courseUpdatesInitialValues, intl) => {
  const updatesValidationSchema = Yup.object().shape({
    id: Yup.number().required(),
    date: Yup.string().min(1).required(),
    content: Yup.string(),
  });

  switch (requestType) {
  case REQUEST_TYPES.edit_handouts:
    return {
      currentContent: courseUpdatesInitialValues.data,
      modalTitle: intl.formatMessage(messages.editHandoutsTitle),
      validationSchema: Yup.object().shape(),
      contentFieldName: 'data',
      submitButtonText: intl.formatMessage(messages.saveButton),
    };
  case REQUEST_TYPES.add_new_update:
    return {
      currentContent: courseUpdatesInitialValues.content,
      modalTitle: intl.formatMessage(messages.addNewUpdateTitle),
      validationSchema: updatesValidationSchema,
      contentFieldName: 'content',
      submitButtonText: intl.formatMessage(messages.postButton),
    };
  case REQUEST_TYPES.edit_update:
    return {
      currentContent: courseUpdatesInitialValues.content,
      modalTitle: intl.formatMessage(messages.editUpdateTitle),
      validationSchema: updatesValidationSchema,
      contentFieldName: 'content',
      submitButtonText: intl.formatMessage(messages.postButton),
    };
  default:
    return {};
  }
};

// eslint-disable-next-line import/prefer-default-export
export { geUpdateModalSettings };

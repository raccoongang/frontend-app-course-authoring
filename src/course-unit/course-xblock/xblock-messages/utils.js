import { MESSAGE_ERROR_TYPES } from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const getMessagesBlockType = (messages) => {
  let type = MESSAGE_ERROR_TYPES.warning;
  if (messages.some((message) => message.type === MESSAGE_ERROR_TYPES.error)) {
    type = MESSAGE_ERROR_TYPES.error;
  }
  return type;
};

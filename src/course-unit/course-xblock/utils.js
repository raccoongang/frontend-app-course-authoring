import { getConfig } from '@edx/frontend-platform';

const getXBlockHandlerUrl = async (blockId, handlerName) => {
  const baseUrl = getConfig().STUDIO_BASE_URL;

  return `${baseUrl}/xblock/${blockId}/handler/${handlerName}`;
};

// eslint-disable-next-line import/prefer-default-export
export const getHandlerUrl = async (blockId) => getXBlockHandlerUrl(blockId, 'handler_name');

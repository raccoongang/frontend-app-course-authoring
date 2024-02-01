import { getConfig } from '@edx/frontend-platform';

import { objectToQueryString } from '../../utils';

export const iframeParams = {
  show_title: 0,
  show_bookmark: 0,
  recheck_access: 1,
  view: 'student_view',
  allow_render_for_mfe: 1,
};

export const getIFrameUrl = ({ blockId }) => {
  const xblockUrl = `${getConfig().LMS_BASE_URL}/xblock/${blockId}`;
  return `${xblockUrl}?${objectToQueryString(iframeParams)}`;
};

export default { getIFrameUrl };

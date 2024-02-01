import { getConfig } from '@edx/frontend-platform';

import { objectToQueryString } from '../../utils';
import { getIFrameUrl, iframeParams } from './urls';

const props = {
  blockId: 'test-id',
  view: 'student_view',
};

describe('urls module', () => {
  describe('getIFrameUrl', () => {
    test('return correct iframe url', () => {
      const params = objectToQueryString(iframeParams);
      expect(getIFrameUrl(props)).toEqual(`${getConfig().LMS_BASE_URL}/xblock/${props.blockId}?${params}`);
    });
  });
});

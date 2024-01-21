import { useIntl } from '@edx/frontend-platform/i18n';

import { getUnitReleaseStatus, UNIT_VISIBILITY_STATES } from '../constants';
import messages from './messages';
import { extractCourseUnitId } from './utils';

const useCourseUnitData = (unitData) => {
  const intl = useIntl();
  const { hasChanges, published, visibilityState } = unitData;

  const locationId = extractCourseUnitId(unitData);
  const visibleToStaffOnly = visibilityState === UNIT_VISIBILITY_STATES.staffOnly;
  let title = intl.formatMessage(messages.sidebarTitleDraftNeverPublished);
  let releaseLabel = getUnitReleaseStatus(intl).release;

  switch (visibilityState) {
  case UNIT_VISIBILITY_STATES.staffOnly:
    title = intl.formatMessage(messages.sidebarTitleVisibleToStaffOnly);
    break;
  case UNIT_VISIBILITY_STATES.live:
    title = intl.formatMessage(messages.sidebarTitlePublishedAndLive);
    releaseLabel = getUnitReleaseStatus(intl).released;
    break;
  case UNIT_VISIBILITY_STATES.ready:
    releaseLabel = getUnitReleaseStatus(intl).scheduled;
    break;
  default:
    if (published) {
      title = hasChanges
        ? intl.formatMessage(messages.sidebarTitleDraftUnpublishedChanges)
        : intl.formatMessage(messages.sidebarTitlePublishedNotYetReleased);
    }
    break;
  }

  return {
    title,
    locationId,
    releaseLabel,
    visibilityState,
    visibleToStaffOnly,
  };
};

export default useCourseUnitData;

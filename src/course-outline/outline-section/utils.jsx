import {
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
  EditOutline as EditOutlineIcon,
} from '@edx/paragon/icons';

import { SECTION_BADGE_STATUTES, STAFF_ONLY } from '../constants';
import messages from './messages';

/**
 * Get section status depended on section info
 * @param {bool} published - value from section info
 * @param {bool} releasedToStudents - value from section info
 * @param {bool} visibleToStaffOnly - value from section info
 * @param {string} visibilityState - value from section info
 * @param {bool} staffOnlyMessage - value from section info
 * @returns {typeof SECTION_BADGE_STATUTES}
 */
const getSectionStatus = ({
  published,
  releasedToStudents,
  visibleToStaffOnly,
  visibilityState,
  staffOnlyMessage,
}) => {
  switch (true) {
  case published && releasedToStudents:
    return SECTION_BADGE_STATUTES.live;
  case published && !releasedToStudents:
    return SECTION_BADGE_STATUTES.published_not_live;
  case visibleToStaffOnly && staffOnlyMessage && visibilityState === STAFF_ONLY:
    return SECTION_BADGE_STATUTES.staff_only;
  case !published:
    return SECTION_BADGE_STATUTES.draft;
  default:
    return '';
  }
};

/**
 * Get section badge status content
 * @param {string} status - value from on getSectionStatus util
 * @returns {
 *   badgeTitle: string,
 *   badgeIcon: node,
 * }
 */
const getSectionStatusBadgeContent = (status, intl) => {
  switch (status) {
  case SECTION_BADGE_STATUTES.live:
    return {
      badgeTitle: intl.formatMessage(messages.statusBadgeLive),
      badgeIcon: CheckCircleIcon,
    };
  case SECTION_BADGE_STATUTES.published_not_live:
    return {
      badgeTitle: intl.formatMessage(messages.statusBadgePublishedNotLive),
      badgeIcon: '',
    };
  case SECTION_BADGE_STATUTES.staff_only:
    return {
      badgeTitle: intl.formatMessage(messages.statusBadgeStuffOnly),
      badgeIcon: LockIcon,
    };
  case SECTION_BADGE_STATUTES.draft:
    return {
      badgeTitle: intl.formatMessage(messages.statusBadgeDraft),
      badgeIcon: EditOutlineIcon,
    };
  default:
    return {
      badgeTitle: '',
      badgeIcon: '',
    };
  }
};

export { getSectionStatus, getSectionStatusBadgeContent };

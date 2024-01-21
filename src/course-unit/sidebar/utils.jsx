import {
  CheckCircle as CheckCircleIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  InfoOutline as InfoOutlineIcon,
} from '@edx/paragon/icons';

import { COLORS, UNIT_VISIBILITY_STATES } from '../constants';
import messages from './messages';

/**
 * Get information about the publishing status.
 * @param {Object} intl - The internationalization object.
 * @param {boolean} hasChanges - Indicates if there are unpublished changes.
 * @param {string} editedBy - The user who edited the content.
 * @param {string} editedOn - The timestamp when the content was edited.
 * @param {string} publishedBy - The user who last published the content.
 * @param {string} publishedOn - The timestamp when the content was last published.
 * @returns {string} Publish information based on the provided parameters.
 */
export const getPublishInfo = (intl, hasChanges, editedBy, editedOn, publishedBy, publishedOn) => {
  if (hasChanges && editedOn && editedBy) {
    return intl.formatMessage(messages.publishInfoDraftSaved, { editedOn, editedBy });
  } if (publishedOn && publishedBy) {
    return intl.formatMessage(messages.publishLastPublished, { publishedOn, publishedBy });
  }

  return intl.formatMessage(messages.publishInfoPreviouslyPublished);
};

/**
 * Get information about the release status.
 * @param {Object} intl - The internationalization object.
 * @param {string} releaseDate - The release date of the content.
 * @param {string} releaseDateFrom - The section name associated with the release date.
 * @returns {string|ReactElement} Release information based on the provided parameters.
 */
export const getReleaseInfo = (intl, releaseDate, releaseDateFrom) => {
  if (releaseDate) {
    return (
      <span className="course-unit-sidebar-date-and-with">
        <h6 className="course-unit-sidebar-date-timestamp m-0 d-inline">
          {releaseDate}&nbsp;
        </h6>
        {intl.formatMessage(messages.releaseInfoWithSection, { sectionName: releaseDateFrom })}
      </span>
    );
  }

  return intl.formatMessage(messages.releaseInfoUnscheduled);
};

/**
 * Get the visibility title.
 * @param {Object} intl - The internationalization object.
 * @param {boolean} releasedToStudents - Indicates if the content is released to students.
 * @param {boolean} published - Indicates if the content is published.
 * @param {boolean} hasChanges - Indicates if there are unpublished changes.
 * @returns {string} The visibility title determined by the provided parameters.
 */
export const getVisibilityTitle = (intl, releasedToStudents, published, hasChanges) => {
  if (releasedToStudents && published && !hasChanges) {
    return intl.formatMessage(messages.visibilityIsVisibleToTitle);
  }

  return intl.formatMessage(messages.visibilityWillBeVisibleToTitle);
};

/**
 * Get the icon variant based on the provided visibility state and publication status.
 * @param {string} visibilityState - The visibility state of the content.
 * @param {boolean} published - Indicates if the content is published.
 * @param {boolean} hasChanges - Indicates if there are unpublished changes.
 * @returns {Object} An object containing the icon component and color variant.
 *   - iconSrc: The source component for the icon.
 *   - colorVariant: The color variant for the icon.
 */
export const getIconVariant = (visibilityState, published, hasChanges) => {
  if (visibilityState === UNIT_VISIBILITY_STATES.staffOnly) {
    // Visible to staff only
    return { iconSrc: InfoOutlineIcon, colorVariant: COLORS.BLACK };
  } if (visibilityState === UNIT_VISIBILITY_STATES.live) {
    // Published and live
    return { iconSrc: CheckCircleIcon, colorVariant: COLORS.GREEN };
  } if (published && !hasChanges) {
    // Published (not yet released)
    return { iconSrc: CheckCircleOutlineIcon, colorVariant: COLORS.BLACK };
  } if (published && hasChanges) {
    // Draft (unpublished changes)
    return { iconSrc: InfoOutlineIcon, colorVariant: COLORS.BLACK };
  }

  return { iconSrc: InfoOutlineIcon, colorVariant: COLORS.BLACK };
};

/**
 * Extracts the clear course unit ID from the given course unit data.
 * @param {Object} courseUnitData - The course unit data object containing the ID.
 * @returns {string} The clear course unit ID extracted from the provided data.
 */
export const extractCourseUnitId = (courseUnitData) => courseUnitData.id.match(/block@(.+)$/)[1];

import {
  CheckCircle as CheckCircleIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  InfoOutline as InfoOutlineIcon,
} from '@edx/paragon/icons/es5';

export const getPublishInfo = (hasChanges, editedBy, editedOn, publishedBy, publishedOn) => {
  if (hasChanges && editedOn && editedBy) {
    return `Draft saved on ${editedOn} by ${editedBy}`;
  } if (publishedOn && publishedBy) {
    return `Last published ${publishedOn} by ${publishedBy}`;
  }

  return 'Previously published';
};

export const getReleaseInfo = (releaseDate, releaseDateFrom) => {
  if (releaseDate) {
    return (
      <span className="course-unit-sidebar-date-and-with">
        <h6 className="course-unit-sidebar-date-timestamp m-0 d-inline">
          {releaseDate}
        </h6> with {releaseDateFrom}
      </span>
    );
  }

  return 'Unscheduled';
};

export const getVisibilityTitle = (releasedToStudents, published, hasChanges) => {
  if (releasedToStudents && published && !hasChanges) {
    return 'IS VISIBLE TO';
  }

  return 'WILL BE VISIBLE TO ';
};

export const getIconVariant = (visibilityState, published, hasChanges) => {
  const BLACK_COLOR = '#000';
  const GREEN_COLOR = '#0D7D4D';

  if (visibilityState === 'staff_only') {
    // Visible to staff only
    return { icon: InfoOutlineIcon, color: BLACK_COLOR };
  } if (visibilityState === 'live') {
    // Published and live
    return { icon: CheckCircleIcon, color: GREEN_COLOR };
  } if (published && !hasChanges) {
    // Published (not yet released)
    return { icon: CheckCircleOutlineIcon, color: BLACK_COLOR };
  } if (published && hasChanges) {
    // Draft (unpublished changes)
    return { icon: InfoOutlineIcon, color: BLACK_COLOR };
  }

  return {
    icon: InfoOutlineIcon,
    color: BLACK_COLOR,
  };
};

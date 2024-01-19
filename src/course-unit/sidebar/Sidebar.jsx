import {
  Form, Card, Icon, Stack, Button,
} from '@edx/paragon';
import {
  CheckCircle as CheckCircleIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  InfoOutline as InfoOutlineIcon,
} from '@edx/paragon/icons';
import { useSelector } from 'react-redux';
import { getCourseUnitData } from '../data/selectors';
import courseUnit from '../CourseUnit';
import classNames from 'classnames';

/*
* - Published and live
* - Published (not yet released)
* - Draft (never published)
* - Draft (unpublished changes)
* - Visible to staff only
* */

const Sidebar = ({ isDisplayUnitLocation }) => {
  const unitData = useSelector(getCourseUnitData);
  const {
    hasChanges, editedOn, editedBy, publishedBy, publishedOn, visibilityState, releaseDateFrom,
    releaseDate, published, hasExplicitStaffLock, enableCopyPasteUnits, releasedToStudents,
  } = unitData;

  const visibleToStaffOnly = visibilityState === 'staff_only';
  let title = 'Draft (never published)';
  if (visibilityState === 'staff_only') {
    title = 'Visible to staff only';
  } else if (visibilityState === 'live') {
    title = 'Published and live';
  } else if (published && !hasChanges) {
    title = 'Published (not yet released)';
  } else if (published && hasChanges) {
    title = 'Draft (unpublished changes)';
  }

  let releaseLabel = 'RELEASE';
  if (visibilityState === 'live') {
    releaseLabel = 'RELEASE';
  } else if (visibilityState === 'ready') {
    releaseLabel = 'SCHEDULED';
  }

  if (isDisplayUnitLocation) {
    const locationId = unitData.id.match(/block@(.+)$/)[1];
    return (
      <Card className="course-unit-sidebar">
        <Stack className="course-unit-sidebar-header" direction="horizontal">
          <h3 className="course-unit-sidebar-header-title m-0">
            Unit location
          </h3>
        </Stack>
        <Card.Section className="course-unit-sidebar-date">
          <Stack>
            <span>
              <h5 className="course-unit-sidebar-date-stage m-0">LOCATION ID</h5>
              <p className="m-0">{locationId}</p>
            </span>
          </Stack>
        </Card.Section>
        <Card.Footer className="course-unit-sidebar-footer" orientation="horizontal">
          <Stack className="course-unit-sidebar-visibility">
            <small className="course-unit-sidebar-visibility-title">
              To create a link to this unit from an HTML component in this course,
              enter /jump_to_id/{locationId} as the URL value
            </small>
          </Stack>
        </Card.Footer>
      </Card>
    );
  }

  console.log('unitData ===>>>', unitData);

  const getPublishText = () => {
    if (hasChanges && editedOn && editedBy) {
      return `Draft saved on ${editedOn} by ${editedBy}`;
    } if (publishedOn && publishedBy) {
      return `Last published ${publishedOn} by ${publishedBy}`;
    }

    return 'Previously published';
  };

  const getReleaseStatus = () => {
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

  const getVisibilityTitle = () => {
    if (releasedToStudents && published && !hasChanges) {
      return 'IS VISIBLE TO';
    }

    return 'WILL BE VISIBLE TO ';
  };

  const getIconSource = () => {
    if (visibilityState === 'staff_only') {
      // Visible to staff only
      return InfoOutlineIcon;
    } if (visibilityState === 'live') {
      // Published and live
      return CheckCircleIcon;
    } if (published && !hasChanges) {
      // Published (not yet released)
      return CheckCircleOutlineIcon;
    } if (published && hasChanges) {
      // Draft (unpublished changes)
      return InfoOutlineIcon;
    }

    return InfoOutlineIcon;
  };

  const getIconColor = () => {
    const BLACK_COLOR = '#000';
    const GREEN_COLOR = '#0D7D4D';

    if (visibilityState === 'staff_only') {
      // Visible to staff only
      return BLACK_COLOR;
    } if (visibilityState === 'live') {
      // Published and live
      return GREEN_COLOR;
    } if (published && !hasChanges) {
      // Published (not yet released)
      return BLACK_COLOR;
    } if (published && hasChanges) {
      // Draft (unpublished changes)
      return BLACK_COLOR;
    }

    return BLACK_COLOR;
  };

  return (
    <Card
      className={classNames('course-unit-sidebar', {
        'is-scheduled': releaseDate,
        'is-stuff-only': visibleToStaffOnly,
      })}
    >
      <Stack className="course-unit-sidebar-header" direction="horizontal">
        <Icon
          className="course-unit-sidebar-header-icon"
          svgAttrs={{ color: getIconColor() }}
          src={getIconSource()}
        />
        <h3 className="course-unit-sidebar-header-title m-0">
          {title}
        </h3>
      </Stack>
      <Card.Section className="course-unit-sidebar-date">
        <Stack>
          <span>
            {getPublishText()}
          </span>
          <span className="mt-3.5">
            <h5 className="course-unit-sidebar-date-stage m-0">{releaseLabel}</h5>
            {getReleaseStatus()}
          </span>
          <p className="mt-3.5 mb-0">
            Note: Do not hide graded assignments after they have been released.
          </p>
        </Stack>
      </Card.Section>
      <Card.Footer className="course-unit-sidebar-footer" orientation="horizontal">
        <Stack className="course-unit-sidebar-visibility">
          <small className="course-unit-sidebar-visibility-title">
            {getVisibilityTitle()}
          </small>
          {visibleToStaffOnly ? (
            <>
              <h6 className="course-unit-sidebar-visibility-copy">Staff only</h6>
              {!hasExplicitStaffLock && (
                <mark>=== hasExplicitStaffLock ===</mark>
              )}
            </>
          ) : (
            <h6 className="course-unit-sidebar-visibility-copy">Staff and learners</h6>
          )}
          <Form.Checkbox className="course-unit-sidebar-visibility-checkbox" checked={hasExplicitStaffLock}>
            Hide from learners
          </Form.Checkbox>
          {(!published || hasChanges) && (
            <Button className="mt-3.5" variant="outline-primary" size="sm">
              Publish
            </Button>
          )}
          {(published && hasChanges) && (
            <Button className="mt-2" variant="tertiary" size="sm">
              Discard changes
            </Button>
          )}
          {/* TODO: Unit copying functionality will be added to: https://youtrack.raccoongang.com/issue/AXIMST-375 */}
          {enableCopyPasteUnits && (
            <Button className="mt-2" variant="outline-primary" size="sm">
              Copy unit
            </Button>
          )}
        </Stack>
      </Card.Footer>
    </Card>
  );
};

export default Sidebar;

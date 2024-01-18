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

/*
* - Published and live
* - Published (not yet released)
* - Draft (never published)
* - Draft (unpublished changes)
* - Visible to staff only
* */

const Sidebar = ({ isDisplayUnitLocation }) => {
  const unitData = useSelector(getCourseUnitData);
  const visibleText = unitData.currentlyVisibleToStudents ? 'IS VISIBLE TO' : 'WILL VISIBLE TO';
  const unitStatus = {
    release: 'RELEASE',
    scheduled: 'SCHEDULED',
  };
  const iconVariants = {
    publishedAndLive: CheckCircleIcon,
    publishedNotYetReleased: CheckCircleOutlineIcon,
    draft: InfoOutlineIcon,
  };

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
    if (unitData.hasChanges) {
      return 'Draft saved on';
    }

    if (unitData.publishedBy && !unitData.releaseDate) {
      return 'Last published';
    }

    return 'Draft saved on';
  };

  const getIconSource = () => {
    if (unitData.hasChanges) {
      return iconVariants.draft;
    }

    if (unitData.publishedBy && !unitData.releaseDate) {
      return iconVariants.publishedNotYetReleased;
    }

    return iconVariants.draft;
  };

  const getIconColor = () => {
    if (!unitData.publishedBy) {
      return '#000';
    }

    if (unitData.hasChanges) {
      return '#000';
    }

    if (unitData.publishedBy && !unitData.releaseDate) {
      return '#000';
    }

    return '#0D7D4D';
  };

  const getHeaderTitle = () => {
    if (!unitData.publishedBy) {
      return 'Draft (never published)';
    }

    if (unitData.hasChanges) {
      return 'Draft (unpublished changes)';
    }

    if (unitData.publishedBy && !unitData.releaseDate) {
      return 'Published (not yet released)';
    }

    return 'Draft (never published)';
  };

  return (
    <Card className="course-unit-sidebar">
      <Stack className="course-unit-sidebar-header" direction="horizontal">
        <Icon
          className="course-unit-sidebar-header-icon"
          svgAttrs={{ color: getIconColor() }}
          src={getIconSource()}
        />
        <h3 className="course-unit-sidebar-header-title m-0">
          {getHeaderTitle()}
        </h3>
      </Stack>
      <Card.Section className="course-unit-sidebar-date">
        <Stack>
          <span>
            {getPublishText()} {unitData.editedOn} by {unitData.editedBy}
          </span>
          {false && (
            <span className="mt-3.5">
              <h5 className="course-unit-sidebar-date-stage m-0">{unitStatus.release}</h5>
              {unitData.releaseDate ? (
                <>
                  <h6 className="course-unit-sidebar-date-timestamp m-0 d-inline">
                    Feb 05, 2013 at 05:00 UTC
                  </h6> with Subsection “Homework - Labs and Demos”
                </>
              ) : (
                <p className="m-0">Unreleased</p>
              )}
            </span>
          )}
          <span className="mt-3.5">
            <h5 className="course-unit-sidebar-date-stage m-0">{unitStatus.release}</h5>
            {!unitData.releaseData && (
              <p className="m-0">Unscheduled</p>
            )}
          </span>
          <p className="mt-3.5 mb-0">
            Note: Do not hide graded assignments after they have been released.
          </p>
        </Stack>
      </Card.Section>
      <Card.Footer className="course-unit-sidebar-footer" orientation="horizontal">
        <Stack className="course-unit-sidebar-visibility">
          <small className="course-unit-sidebar-visibility-title">
            {visibleText}
          </small>
          <h6 className="course-unit-sidebar-visibility-copy">
            {unitData.visibilityState === 'staff_only' ? 'Staff only' : 'Staff and learners'}
          </h6>
          <Form.Checkbox className="course-unit-sidebar-visibility-checkbox">
            Hide from learners
          </Form.Checkbox>
          {unitData.hasChanges && (
            <>
              <Button className="mt-3.5" variant="outline-primary" size="sm">
                Publish
              </Button>
              {unitData.publishedBy && (
                <Button className="mt-2" variant="tertiary" size="sm">
                  Discard changes
                </Button>
              )}
            </>
          )}
        </Stack>
      </Card.Footer>
    </Card>
  );
};

export default Sidebar;

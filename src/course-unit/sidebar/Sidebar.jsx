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

/*
* - Published and live
* - Published (not yet released)
* - Draft (never published)
* - Draft (unpublished changes)
* - Visible to staff only
* */

const Sidebar = () => {
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
  const publishTexts = unitData.publishedBy && !unitData.releaseDate ? 'Last published' : 'Draft saved on';
  console.log('unitData ===>>>', unitData);

  const getIconSource = () => {
    if (unitData.publishedBy && !unitData.releaseDate) {
      return iconVariants.publishedNotYetReleased;
    }

    return iconVariants.draft;
  };

  const getIconColor = () => {
    if (unitData.publishedBy && !unitData.releaseDate) {
      return '#000';
    }

    return '#0D7D4D';
  };

  const getHeaderTitle = () => {
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
            {publishTexts} {unitData.editedOn} by {unitData.editedBy}
          </span>
          {true ? (
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
          ) : (
            <p className="mt-3.5 mb-0">
              Note: Do not hide graded assignments after they have been released.
            </p>
          )}
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
              <Button className="mt-3.5" variant="outline-primary">
                Publish
              </Button>
              <Button className="mt-3.5" variant="tertiary">
                Discard changes
              </Button>
            </>
          )}
        </Stack>
      </Card.Footer>
    </Card>
  );
};

export default Sidebar;

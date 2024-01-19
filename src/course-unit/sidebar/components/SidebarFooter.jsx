import {
  Button, Card, Form, Stack,
} from '@edx/paragon';

import { getVisibilityTitle } from '../utils';

const SidebarFooter = ({
  visibleToStaffOnly,
  published,
  hasChanges,
  enableCopyPasteUnits,
  hasExplicitStaffLock,
  isDisplayUnitLocation,
  locationId,
  releasedToStudents,
}) => (
  <Card.Footer className="course-unit-sidebar-footer" orientation="horizontal">
    <Stack className="course-unit-sidebar-visibility">
      {isDisplayUnitLocation ? (
        <small className="course-unit-sidebar-visibility-title">
          To create a link to this unit from an HTML component in this course,
          enter /jump_to_id/{locationId} as the URL value
        </small>
      ) : (
        <>
          <small className="course-unit-sidebar-visibility-title">
            {getVisibilityTitle(releasedToStudents, published, hasChanges)}
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
            <Button className="mt-2" variant="link" size="sm">
              Discard changes
            </Button>
          )}
          {/* TODO: Unit copying functionality will be added to: https://youtrack.raccoongang.com/issue/AXIMST-375 */}
          {enableCopyPasteUnits && (
            <Button className="mt-2" variant="outline-primary" size="sm">
              Copy unit
            </Button>
          )}
        </>
      )}
    </Stack>
  </Card.Footer>
);

export default SidebarFooter;

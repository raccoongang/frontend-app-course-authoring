import { Card, Stack } from '@edx/paragon';

import { getPublishInfo, getReleaseInfo } from '../utils';

const SidebarBody = ({
  releaseLabel,
  isDisplayUnitLocation,
  locationId,
  hasChanges,
  editedBy,
  editedOn,
  publishedBy,
  publishedOn,
  releaseDate,
  releaseDateFrom,
}) => (
  <Card.Body className="course-unit-sidebar-date">
    <Stack>
      {isDisplayUnitLocation ? (
        <span>
          <h5 className="course-unit-sidebar-date-stage m-0">LOCATION ID</h5>
          <p className="m-0">{locationId}</p>
        </span>
      ) : (
        <>
          <span>
            {getPublishInfo(hasChanges, editedBy, editedOn, publishedBy, publishedOn)}
          </span>
          <span className="mt-3.5">
            <h5 className="course-unit-sidebar-date-stage m-0">{releaseLabel}</h5>
            {getReleaseInfo(releaseDate, releaseDateFrom)}
          </span>
          <p className="mt-3.5 mb-0">
            Note: Do not hide graded assignments after they have been released.
          </p>
        </>
      )}
    </Stack>
  </Card.Body>
);

export default SidebarBody;

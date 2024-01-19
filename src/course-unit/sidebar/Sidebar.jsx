import { Card } from '@edx/paragon';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { getCourseUnitData } from '../data/selectors';
import { SidebarBody, SidebarFooter, SidebarHeader } from './components';
import useCourseUnitData from './hooks';

const Sidebar = ({ isDisplayUnitLocation }) => {
  const unitData = useSelector(getCourseUnitData);

  const {
    title,
    published,
    releaseLabel,
    locationId,
    visibleToStaffOnly,
    editedOn,
    editedBy,
    publishedBy,
    publishedOn,
    releaseDateFrom,
    releaseDate,
    hasChanges,
    visibilityState,
    hasExplicitStaffLock,
    enableCopyPasteUnits,
    releasedToStudents,
  } = useCourseUnitData(unitData);

  return (
    <Card
      className={classNames('course-unit-sidebar', {
        'is-scheduled': releaseDate,
        'is-stuff-only': visibleToStaffOnly,
      })}
    >
      <SidebarHeader
        isDisplayUnitLocation={isDisplayUnitLocation}
        title={title}
        visibilityState={visibilityState}
        published={published}
        hasChanges={hasChanges}
      />
      <SidebarBody
        releaseLabel={releaseLabel}
        locationId={locationId}
        isDisplayUnitLocation={isDisplayUnitLocation}
        hasChanges={hasChanges}
        editedBy={editedBy}
        editedOn={editedOn}
        publishedBy={publishedBy}
        publishedOn={publishedOn}
        releaseDate={releaseDate}
        releaseDateFrom={releaseDateFrom}
      />
      <SidebarFooter
        enableCopyPasteUnits={enableCopyPasteUnits}
        hasExplicitStaffLock={hasExplicitStaffLock}
        published={published}
        visibleToStaffOnly={visibleToStaffOnly}
        isDisplayUnitLocation={isDisplayUnitLocation}
        hasChanges={hasChanges}
        locationId={locationId}
        releasedToStudents={releasedToStudents}
      />
    </Card>
  );
};

export default Sidebar;

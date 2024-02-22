import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { Card } from '@openedx/paragon';

import { getCourseUnitData } from '../data/selectors';
import { SidebarBody, SidebarFooter, SidebarHeader } from './components';
import useCourseUnitData from './hooks';
import { TagsSidebarBody } from '../../content-tags-drawer/tags-sidebar';
import TagsSidebarHeader from '../../content-tags-drawer/tags-sidebar/TagsSidebarHeader';

const Sidebar = ({ variant }) => {
  const {
    title,
    locationId,
    releaseLabel,
    visibilityState,
    visibleToStaffOnly,
  } = useCourseUnitData(useSelector(getCourseUnitData));

  let sidebarHeader;
  let sidebarBody;
  let hideFooter = false;
  let className = '';
  switch (variant) {
  case 'publish':
    sidebarHeader = (
      <SidebarHeader
        title={title}
        visibilityState={visibilityState}
      />
    );
    sidebarBody = (
      <SidebarBody
        releaseLabel={releaseLabel}
      />
    );
    break;
  case 'location':
    sidebarHeader = (
      <SidebarHeader
        title={title}
        visibilityState={visibilityState}
        isDisplayUnitLocation
      />
    );
    sidebarBody = (
      <SidebarBody
        locationId={locationId}
        releaseLabel={releaseLabel}
        isDisplayUnitLocation
      />
    );
    break;
  case 'tags':
    sidebarHeader = (
      <TagsSidebarHeader />
    );
    sidebarBody = (
      <TagsSidebarBody />
    );
    hideFooter = true;
    className = 'tags-sidebar';
    break;
  default:
    break;
  }

  return (
    <Card
      className={classNames('course-unit-sidebar', className, {
        'is-stuff-only': visibleToStaffOnly,
      })}
      data-testid="course-unit-sidebar"
    >
      { sidebarHeader }
      { sidebarBody }
      { !hideFooter
        && (
          <SidebarFooter
            locationId={locationId}
            isDisplayUnitLocation={variant === 'location'}
          />
        )}
    </Card>
  );
};

Sidebar.propTypes = {
  variant: PropTypes.string.isRequired,
};

export default Sidebar;

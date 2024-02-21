import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { Card } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import { getCourseUnitData } from '../data/selectors';
import { SidebarBody, SidebarFooter, SidebarHeader } from './components';
import useCourseUnitData from './hooks';
import messages from './messages';
import TagsSidebarBody from './components/TagsSidebarBody';

const Sidebar = ({ variant }) => {
  const intl = useIntl();
  const {
    title,
    locationId,
    releaseLabel,
    visibilityState,
    visibleToStaffOnly,
  } = useCourseUnitData(useSelector(getCourseUnitData));

  let sidebarTitle;
  let sidebarBody;
  let hideFooter = false;
  let hideIcon = false;
  switch (variant) {
  case 'publish':
    sidebarTitle = title;
    sidebarBody = (
      <SidebarBody
        releaseLabel={releaseLabel}
      />
    );
    break;
  case 'location':
    sidebarTitle = intl.formatMessage(messages.sidebarHeaderUnitLocationTitle);
    sidebarBody = (
      <SidebarBody
        locationId={locationId}
        releaseLabel={releaseLabel}
        isDisplayUnitLocation
      />
    );
    break;
  case 'tags':
    sidebarTitle = intl.formatMessage(messages.tagsSidebarTitle);
    sidebarBody = (
      <TagsSidebarBody />
    );
    hideFooter = true;
    hideIcon = true;
    break;
  default:
    break;
  }

  return (
    <Card
      className={classNames('course-unit-sidebar', {
        'is-stuff-only': visibleToStaffOnly,
      })}
      data-testid="course-unit-sidebar"
    >
      <SidebarHeader
        title={sidebarTitle}
        visibilityState={visibilityState}
        hideIcon={hideIcon}
      />
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

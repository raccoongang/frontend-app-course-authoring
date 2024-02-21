import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Icon, Stack } from '@openedx/paragon';

import { getCourseUnitData } from '../../data/selectors';
import { getIconVariant } from '../utils';

const SidebarHeader = ({ title, visibilityState, hideIcon }) => {
  const { hasChanges, published } = useSelector(getCourseUnitData);
  const { iconSrc, colorVariant } = getIconVariant(visibilityState, published, hasChanges);

  return (
    <Stack className="course-unit-sidebar-header" direction="horizontal">
      {!hideIcon && (
        <Icon
          className="course-unit-sidebar-header-icon"
          svgAttrs={{ color: colorVariant }}
          src={iconSrc}
        />
      )}
      <h3 className="course-unit-sidebar-header-title m-0">
        {title}
      </h3>
    </Stack>
  );
};

SidebarHeader.propTypes = {
  title: PropTypes.string.isRequired,
  visibilityState: PropTypes.string.isRequired,
  hideIcon: PropTypes.bool,
};

SidebarHeader.defaultProps = {
  hideIcon: false,
};

export default SidebarHeader;

import { Icon, Stack } from '@edx/paragon';

import { getIconVariant } from '../utils';

const SidebarHeader = ({
  title, visibilityState, published, hasChanges, isDisplayUnitLocation,
}) => {
  const { icon, color } = getIconVariant(visibilityState, published, hasChanges);
  return (
    <Stack className="course-unit-sidebar-header" direction="horizontal">
      {!isDisplayUnitLocation && (
        <Icon
          className="course-unit-sidebar-header-icon"
          svgAttrs={{ color: color }}
          src={icon}
        />
      )}
      <h3 className="course-unit-sidebar-header-title m-0">
        {isDisplayUnitLocation ? 'Unit location' : title}
      </h3>
    </Stack>
  );
};

export default SidebarHeader;

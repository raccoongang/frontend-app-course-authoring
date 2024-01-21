import PropTypes from 'prop-types';
import { Card, Stack } from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from '../../messages';
import UnitVisibilityInfo from './UnitVisibilityInfo';
import ActionButtons from './ActionButtons';

const SidebarFooter = ({ isDisplayUnitLocation, locationId }) => {
  const intl = useIntl();

  return (
    <Card.Footer className="course-unit-sidebar-footer" orientation="horizontal">
      <Stack className="course-unit-sidebar-visibility">
        {isDisplayUnitLocation ? (
          <small className="course-unit-sidebar-visibility-title">
            {intl.formatMessage(messages.unitLocationDescription, { id: locationId })}
          </small>
        ) : (
          <>
            <UnitVisibilityInfo />
            <ActionButtons />
          </>
        )}
      </Stack>
    </Card.Footer>
  );
};

SidebarFooter.propTypes = {
  isDisplayUnitLocation: PropTypes.bool,
  locationId: PropTypes.string,
};

SidebarFooter.defaultProps = {
  isDisplayUnitLocation: false,
  locationId: null,
};

export default SidebarFooter;

import PropTypes from 'prop-types';
import { Dropdown } from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import UnitButton from './UnitButton';

const SequenceNavigationDropdown = ({ unitId, unitIds }) => (
  <Dropdown className="sequence-navigation-dropdown">
    <Dropdown.Toggle variant="outline-primary" className="w-100">
      <FormattedMessage
        defaultMessage="{current} of {total}"
        description="The title of the mobile menu for sequence navigation of units"
        id="learn.course.sequence.navigation.mobile.menu"
        values={{
          current: unitIds.indexOf(unitId) + 1,
          total: unitIds.length,
        }}
      />
    </Dropdown.Toggle>
    <Dropdown.Menu className="w-100">
      {unitIds.map(buttonUnitId => (
        <Dropdown.Item
          as={UnitButton}
          className="w-100"
          isActive={unitId === buttonUnitId}
          key={buttonUnitId}
          showTitle
          unitId={buttonUnitId}
        />
      ))}
    </Dropdown.Menu>
  </Dropdown>
);

SequenceNavigationDropdown.propTypes = {
  unitId: PropTypes.string.isRequired,
  unitIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SequenceNavigationDropdown;

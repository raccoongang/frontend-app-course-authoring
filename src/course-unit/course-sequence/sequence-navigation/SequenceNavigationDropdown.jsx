import PropTypes from 'prop-types';
import { Button, Dropdown } from '@edx/paragon';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import { Plus as PlusIcon } from '@edx/paragon/icons/es5';

import messages from '../messages';
import UnitButton from './UnitButton';

const SequenceNavigationDropdown = ({ unitId, unitIds, handleClick }) => {
  const intl = useIntl();
  return (
    <Dropdown className="sequence-navigation-dropdown">
      <Dropdown.Toggle variant="outline-primary" className="w-100">
        <FormattedMessage
          defaultMessage="{current} of {total}"
          description="The title of the mobile menu for sequence navigation of units"
          id="course-authoring.course-unit.sequence.navigation.mobile.menu"
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
        <Button
          className="sequence-navigation-tabs-new-unit-btn"
          variant="outline-primary"
          iconBefore={PlusIcon}
          onClick={handleClick}
        >
          {intl.formatMessage(messages.newUnitBtnText)}
        </Button>
      </Dropdown.Menu>
    </Dropdown>
  );
};

SequenceNavigationDropdown.propTypes = {
  unitId: PropTypes.string.isRequired,
  unitIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default SequenceNavigationDropdown;

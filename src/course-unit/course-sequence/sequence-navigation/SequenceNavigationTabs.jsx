import PropTypes from 'prop-types';
import { Button } from '@edx/paragon';
import { Plus as PlusIcon } from '@edx/paragon/icons';
import { Link } from 'react-router-dom';

import { useIndexOfLastVisibleChild } from '../hooks';
import SequenceNavigationDropdown from './SequenceNavigationDropdown';
import UnitButton from './UnitButton';

const SequenceNavigationTabs = ({ unitIds, unitId, onNavigate }) => {
  const [
    indexOfLastVisibleChild,
    containerRef,
    invisibleStyle,
  ] = useIndexOfLastVisibleChild();
  const shouldDisplayDropdown = indexOfLastVisibleChild === -1;

  return (
    <div className="sequence-navigation-tabs-wrapper">
      <div className="sequence-navigation-tabs-container d-flex" ref={containerRef}>
        <div
          className="sequence-navigation-tabs d-flex flex-grow-1"
          style={shouldDisplayDropdown ? invisibleStyle : null}
        >
          {unitIds.map((buttonUnitId) => (
            <UnitButton
              key={buttonUnitId}
              unitId={buttonUnitId}
              isActive={unitId === buttonUnitId}
              onClick={onNavigate}
            />
          ))}
          {/* TODO: The functionality of the New unit button will be implemented in https://youtrack.raccoongang.com/issue/AXIMST-14 */}
          <Button
            className="sequence-navigation-tabs-new-unit-btn disabled"
            variant="outline-primary"
            iconBefore={PlusIcon}
            as={Link}
            to="/"
          >
            New unit
          </Button>
        </div>
      </div>
      {shouldDisplayDropdown && (
        <SequenceNavigationDropdown
          unitId={unitId}
          onNavigate={onNavigate}
          unitIds={unitIds}
        />
      )}
    </div>
  );
};

SequenceNavigationTabs.propTypes = {
  unitId: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
  unitIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SequenceNavigationTabs;

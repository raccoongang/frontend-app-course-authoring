import { Button } from '@edx/paragon';
import { Plus } from '@edx/paragon/icons';
import PropTypes from 'prop-types';
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
    <div style={{ flexBasis: '100%', minWidth: 0 }}>
      <div className="sequence-navigation-tabs-container" ref={containerRef}>
        <div
          className="sequence-navigation-tabs d-flex flex-grow-1"
          style={shouldDisplayDropdown ? invisibleStyle : null}
        >
          {unitIds?.map(buttonUnitId => (
            <UnitButton
              key={buttonUnitId}
              isActive={unitId === buttonUnitId}
              onClick={onNavigate}
              unitId={buttonUnitId}
            />
          ))}
          <Button
            variant="outline-primary"
            className="disabled new-unit-btn"
            iconBefore={Plus}
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

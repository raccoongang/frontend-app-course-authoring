import { Stack, Button } from '@edx/paragon';
import { Plus } from '@edx/paragon/icons';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import UnitButton from './UnitButton';
/* eslint-disable react/prop-types */
const SequenceNavigationTabs = ({
  unitIds,
  unitId,
  sequenceId,
  courseId,
  onNavigate,
}) => {
  // console.log('unitId', unitId);
  // console.log('unitIds', unitIds);

  return (
    <Stack className="sequence-nav-tabs w-100" direction="horizontal" gap={0}>
      {unitIds.map(buttonUnitId => (
        <UnitButton
          key={buttonUnitId}
          isActive={unitId === buttonUnitId}
          onClick={onNavigate}
          unitId={buttonUnitId}
        />
      ))}
      <Button
        variant="outline-primary"
        className="disabled w-100"
        iconBefore={Plus}
        as={Link}
        to="/"
      >
        New unit
      </Button>
    </Stack>
  );
};

SequenceNavigationTabs.propTypes = {
  unitIds: PropTypes.array.isRequired,
};

export default SequenceNavigationTabs;

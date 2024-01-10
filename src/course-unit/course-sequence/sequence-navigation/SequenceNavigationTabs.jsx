import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@edx/paragon';
import { Plus as PlusIcon } from '@edx/paragon/icons';
import { useNavigate } from 'react-router-dom';
import { useIntl } from '@edx/frontend-platform/i18n';

import { addNewSequenceNavigationUnit } from '../../data/thunk';
import SequenceNavigationDropdown from './SequenceNavigationDropdown';
import { addNewUnitId, changeTitleEditFormOpen } from '../../data/slice';
import { useIndexOfLastVisibleChild } from '../hooks';
import messages from '../messages';
import UnitButton from './UnitButton';

const SequenceNavigationTabs = ({ unitIds, unitId }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sequenceId, newUnitId } = useSelector(state => state.courseUnit);
  const { courseId } = useSelector(state => state.courseDetail);

  const [
    indexOfLastVisibleChild,
    containerRef,
    invisibleStyle,
  ] = useIndexOfLastVisibleChild();
  const shouldDisplayDropdown = indexOfLastVisibleChild === -1;

  const handleAddNewSequenceUnit = () => {
    dispatch(addNewSequenceNavigationUnit(unitId, sequenceId));
  };

  useEffect(() => {
    if (newUnitId) {
      const pathToNewSequenceUnit = `/course/${courseId}/container/${newUnitId}/${sequenceId}`;
      navigate(pathToNewSequenceUnit, { replace: true });
      dispatch(addNewUnitId(''));
      dispatch(changeTitleEditFormOpen(true));
    }
  }, [newUnitId]);

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
            />
          ))}
          <Button
            className="sequence-navigation-tabs-new-unit-btn"
            variant="outline-primary"
            iconBefore={PlusIcon}
            onClick={handleAddNewSequenceUnit}
          >
            {intl.formatMessage(messages.newUnitBtnText)}
          </Button>
        </div>
      </div>
      {shouldDisplayDropdown && (
        <SequenceNavigationDropdown
          unitId={unitId}
          unitIds={unitIds}
          handleClick={handleAddNewSequenceUnit}
        />
      )}
    </div>
  );
};

SequenceNavigationTabs.propTypes = {
  unitId: PropTypes.string.isRequired,
  unitIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SequenceNavigationTabs;

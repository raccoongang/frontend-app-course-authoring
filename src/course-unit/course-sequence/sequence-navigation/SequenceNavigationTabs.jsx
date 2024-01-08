import PropTypes from 'prop-types';
import { Button } from '@edx/paragon';
import { Plus as PlusIcon } from '@edx/paragon/icons';
import { Link } from 'react-router-dom';
import { useIntl } from '@edx/frontend-platform/i18n';

import { useIndexOfLastVisibleChild } from '../hooks';
import messages from '../messages';
import SequenceNavigationDropdown from './SequenceNavigationDropdown';
import UnitButton from './UnitButton';
import { useDispatch, useSelector } from 'react-redux';
import { addNewUnitItem } from '../../data/thunk';

const SequenceNavigationTabs = ({ unitIds, unitId }) => {
  const intl = useIntl();
  const dispatch = useDispatch();

  // const { courseId } = useSelector(state => state.courseDetails);
  const [
    indexOfLastVisibleChild,
    containerRef,
    invisibleStyle,
  ] = useIndexOfLastVisibleChild();
  const shouldDisplayDropdown = indexOfLastVisibleChild === -1;
  // console.log('courseId', courseId);

  const handleClick = () => {
    console.log('handleClick');
    dispatch(addNewUnitItem());
  };

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
          {/* TODO: The functionality of the New unit button will be implemented in https://youtrack.raccoongang.com/issue/AXIMST-14 */}
          <Button
            className="sequence-navigation-tabs-new-unit-btn"
            variant="outline-primary"
            iconBefore={PlusIcon}
            onClick={handleClick}
          >
            {intl.formatMessage(messages.newUnitBtnText)}
          </Button>
        </div>
      </div>
      {shouldDisplayDropdown && (
        <SequenceNavigationDropdown
          unitId={unitId}
          unitIds={unitIds}
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

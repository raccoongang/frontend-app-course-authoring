import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { breakpoints, useWindowSize } from '@edx/paragon';
import { injectIntl } from '@edx/frontend-platform/i18n';
import SequenceNavigation from './sequence-navigation/SequenceNavigation';
import { useModel } from '../../generic/model-store';

const Sequence = ({
  courseId,
  sequenceId,
  unitId,
  unitNavigationHandler,
  nextSequenceHandler,
  previousSequenceHandler,
}) => {
  const sequence = useModel('sequences', sequenceId);
  const shouldDisplayNotificationTriggerInSequence = useWindowSize().width < breakpoints.small.minWidth;
  const sequenceStatus = useSelector(state => state.courseUnit.sequenceStatus);

  const handleNavigate = (destinationUnitId) => {
    unitNavigationHandler(destinationUnitId);
  };

  const handleNext = () => {
    const nextIndex = sequence.unitIds.indexOf(unitId) + 1;
    if (nextIndex < sequence.unitIds.length) {
      const newUnitId = sequence.unitIds[nextIndex];
      handleNavigate(newUnitId);
    } else {
      nextSequenceHandler();
    }
  };

  const handlePrevious = () => {
    const previousIndex = sequence.unitIds.indexOf(unitId) - 1;
    if (previousIndex >= 0) {
      const newUnitId = sequence.unitIds[previousIndex];
      handleNavigate(newUnitId);
    } else {
      previousSequenceHandler();
    }
  };

  const defaultContent = (
    <div className="sequence-container d-inline-flex flex-row">
      <div className={classNames('sequence w-100', { 'position-relative': shouldDisplayNotificationTriggerInSequence })}>
        <SequenceNavigation
          courseId={courseId}
          sequenceId={sequenceId}
          unitId={unitId}
          nextHandler={() => {
            handleNext();
          }}
          onNavigate={(destinationUnitId) => {
            handleNavigate(destinationUnitId);
          }}
          previousHandler={() => {
            handlePrevious();
          }}
        />
      </div>
    </div>
  );

  if (sequenceStatus === 'LOADED') {
    return (
      <div>
        {defaultContent}
      </div>
    );
  }

  // sequence status 'failed' and any other unexpected sequence status.
  return (
    <p className="text-center py-5 mx-auto" style={{ maxWidth: '30em' }}>
      failed
    </p>
  );
};

Sequence.propTypes = {
  unitId: PropTypes.string,
  courseId: PropTypes.string.isRequired,
  sequenceId: PropTypes.string,
  unitNavigationHandler: PropTypes.func.isRequired,
  nextSequenceHandler: PropTypes.func.isRequired,
  previousSequenceHandler: PropTypes.func.isRequired,
};

Sequence.defaultProps = {
  sequenceId: null,
  unitId: null,
};

export default injectIntl(Sequence);

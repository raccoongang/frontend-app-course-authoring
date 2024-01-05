import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { breakpoints, useWindowSize } from '@edx/paragon';
import { injectIntl } from '@edx/frontend-platform/i18n';
import React, { useEffect, useState } from 'react';
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
  const sequenceMightBeUnit = useSelector(state => state.courseUnit.sequenceMightBeUnit);
  // console.log('sequenceStatus', sequenceStatus);
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
          sequenceId={sequenceId}
          unitId={unitId}
          courseId={courseId}
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

  // If sequence might be a unit, we want to keep showing a spinner - the courseware container will redirect us when
  // it knows which sequence to actually go to.
  const loading = sequenceStatus === 'LOADING' || (sequenceStatus === 'FAILED' && sequenceMightBeUnit);
  if (loading) {
    if (!sequenceId) {
      return (<div> noContent </div>);
    }
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

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

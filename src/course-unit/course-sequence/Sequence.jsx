import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { ButtonGroup, Button } from '@edx/paragon';
import { ChevronLeft, ChevronRight } from '@edx/paragon/icons';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// http://localhost:2001/course/course-v1:edX+DemoX+Demo_Course/container/block-v1:edX+DemoX+Demo_Course+type@sequential+block@edx_introduction/block-v1:edX+DemoX+Demo_Course+type@vertical+block@vertical_0270f6de40fc

import { useModel } from '../../generic/model-store';

import messages from './messages';
import SequenceNavigationTabs from './sequence-navigation/SequenceNavigationTabs';
import { useSequenceNavigationMetadata } from './hooks';
import { fetchSequence, fetchCourse } from '../data/thunk';

const Sequence = ({
  intl,
  courseId,
  sequenceId,
  unitId,
  unitNavigationHandler,
  nextSequenceHandler,
  previousSequenceHandler,
}) => {
  const { sequenceStatus } = useSelector(state => state.courseUnit);
  // const course = useModel('coursewareMeta', courseId);
  const sequence = useModel('sequences', sequenceId);
  const dispatch = useDispatch();
  // const unit = useModel('units', unitId);
  const globalStore = useSelector(state => state);
  // const courseDetails = useModel('courseDetails', courseId);

  const {
    isFirstUnit, isLastUnit, nextLink, previousLink,
  } = useSequenceNavigationMetadata(
    sequenceId,
    unitId,
  );
  // console.log('isFirstUnit', isFirstUnit);
  // console.log('isLastUnit', isLastUnit);

  useEffect(() => {
    dispatch(fetchSequence(sequenceId));
    dispatch(fetchCourse(courseId));
  }, []);
  console.log('globalStore', globalStore);

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

  const renderPreviousButton = () => {
    const disabled = isFirstUnit;

    return (
      <Button
        className="sequence-nav-button button-prev"
        variant={disabled ? 'brand' : 'outline-primary'}
        iconBefore={ChevronLeft}
        disabled={disabled}
        onClick={() => handlePrevious()}
        as={disabled ? undefined : Link}
        to={disabled ? undefined : previousLink}
      >
        {intl.formatMessage(messages.prevBtnText)}
      </Button>
    );
  };

  const renderNextButton = () => {
    const disabled = isLastUnit;

    return (
      <Button
        className="sequence-nav-button button-next"
        variant={disabled ? 'brand' : 'outline-primary'}
        iconAfter={ChevronRight}
        disabled={disabled}
        onClick={() => handleNext()}
        as={disabled ? undefined : Link}
        to={disabled ? undefined : nextLink}
      >
        {intl.formatMessage(messages.nextBtnText)}
      </Button>
    );
  };

  const renderUnitButtons = () => {
    // if (isLocked) {
    //   return (
    //       <UnitButton unitId={unitId} title="" contentType="lock" isActive onClick={() => {}} />
    //   );
    // }
    if (sequence.unitIds.length === 0) {
      return (
        <div style={{ flexBasis: '100%', minWidth: 0, borderBottom: 'solid 1px #EAEAEA' }} />
      );
    }
    return (
      <SequenceNavigationTabs
        unitIds={sequence.unitIds}
        unitId={unitId}
        sequenceId={sequenceId}
        courseId={courseId}
        // showCompletion={sequence.showCompletion}
        onNavigate={(destinationUnitId) => {
          handleNavigate(destinationUnitId);
        }}
      />
    );
  };

  return sequenceStatus === 'LOADED' && (
    <ButtonGroup
      as="nav"
      className="sequence-nav d-flex"
      aria-label={intl.formatMessage(messages.sequenceNavLabelText)}
    >
      {renderPreviousButton()}
      {renderUnitButtons()}
      {renderNextButton()}
    </ButtonGroup>
  );
};

Sequence.propTypes = {
  intl: intlShape.isRequired,
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

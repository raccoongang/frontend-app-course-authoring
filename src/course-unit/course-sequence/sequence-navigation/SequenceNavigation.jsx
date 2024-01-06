import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  injectIntl, intlShape, isRtl, getLocale,
} from '@edx/frontend-platform/i18n';
import { Button, useWindowSize, breakpoints } from '@edx/paragon';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@edx/paragon/icons';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { useModel } from '../../../generic/model-store';
import messages from '../messages';
import { useSequenceNavigationMetadata } from '../hooks';
import SequenceNavigationTabs from './SequenceNavigationTabs';

const SequenceNavigation = ({
  intl,
  unitId,
  sequenceId,
  className,
  onNavigate,
  nextHandler,
  previousHandler,
}) => {
  const { sequenceStatus } = useSelector(state => state.courseUnit);
  const {
    isFirstUnit, isLastUnit, nextLink, previousLink,
  } = useSequenceNavigationMetadata(sequenceId, unitId);
  const sequence = useModel('sequences', sequenceId);

  const shouldDisplayNotificationTriggerInSequence = useWindowSize().width < breakpoints.small.minWidth;
  const renderUnitButtons = () => {
    if (sequence.unitIds?.length === 0 || unitId === null) {
      return (
        <div style={{ flexBasis: '100%', minWidth: 0, borderBottom: 'solid 1px #EAEAEA' }} />
      );
    }

    return (
      <SequenceNavigationTabs
        unitIds={sequence.unitIds || []}
        unitId={unitId}
        onNavigate={onNavigate}
      />
    );
  };

  const renderPreviousButton = () => {
    const disabled = isFirstUnit;
    const prevArrow = isRtl(getLocale()) ? ChevronRightIcon : ChevronLeftIcon;

    return (
      <Button
        className="sequence-navigation-prev-btn"
        variant="outline-primary"
        iconBefore={prevArrow}
        disabled={disabled}
        onClick={previousHandler}
        as={disabled ? undefined : Link}
        to={disabled ? undefined : previousLink}
      >
        {shouldDisplayNotificationTriggerInSequence ? null : intl.formatMessage(messages.prevBtnText)}
      </Button>
    );
  };

  const renderNextButton = () => {
    const buttonText = intl.formatMessage(messages.nextBtnText);
    const disabled = isLastUnit;
    const nextArrow = isRtl(getLocale()) ? ChevronLeftIcon : ChevronRightIcon;

    return (
      <Button
        className="sequence-navigation-next-btn"
        variant="outline-primary"
        iconAfter={nextArrow}
        disabled={disabled}
        onClick={nextHandler}
        as={disabled ? undefined : Link}
        to={disabled ? undefined : nextLink}
      >
        {shouldDisplayNotificationTriggerInSequence ? null : buttonText}
      </Button>
    );
  };

  return sequenceStatus === 'LOADED' && (
    <nav
      className={classNames('sequence-navigation d-flex', className)}
      style={{ width: shouldDisplayNotificationTriggerInSequence ? '90%' : null }}
    >
      {renderPreviousButton()}
      {renderUnitButtons()}
      {renderNextButton()}
    </nav>
  );
};

SequenceNavigation.propTypes = {
  intl: intlShape.isRequired,
  unitId: PropTypes.string,
  className: PropTypes.string,
  sequenceId: PropTypes.string,
  onNavigate: PropTypes.func.isRequired,
  nextHandler: PropTypes.func.isRequired,
  previousHandler: PropTypes.func.isRequired,
};

SequenceNavigation.defaultProps = {
  sequenceId: null,
  unitId: null,
  className: undefined,
};

export default injectIntl(SequenceNavigation);

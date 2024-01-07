import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { breakpoints, useWindowSize } from '@edx/paragon';
import { injectIntl, useIntl } from '@edx/frontend-platform/i18n';

import Loading from '../../generic/Loading';
import { RequestStatus } from '../../data/constants';
import SequenceNavigation from './sequence-navigation/SequenceNavigation';
import messages from './messages';

const Sequence = ({
  courseId,
  sequenceId,
  unitId,
}) => {
  const intl = useIntl();
  const { IN_PROGRESS, FAILED, SUCCESSFUL } = RequestStatus;
  const shouldDisplayNotificationTriggerInSequence = useWindowSize().width < breakpoints.small.minWidth;
  const { sequenceStatus, sequenceMightBeUnit } = useSelector(state => state.courseUnit);

  const defaultContent = (
    <div className="sequence-container d-inline-flex flex-row">
      <div className={classNames('sequence w-100', { 'position-relative': shouldDisplayNotificationTriggerInSequence })}>
        <SequenceNavigation
          sequenceId={sequenceId}
          unitId={unitId}
          courseId={courseId}
        />
      </div>
    </div>
  );

  // If sequence might be a unit, we want to keep showing a spinner - the courseware container will redirect us when
  // it knows which sequence to actually go to.
  const loading = sequenceStatus === IN_PROGRESS || (sequenceStatus === FAILED && sequenceMightBeUnit);
  if (loading) {
    if (!sequenceId) {
      return (<div>{intl.formatMessage(messages.sequenceNoContent)}</div>);
    }

    return <Loading />;
  }

  if (sequenceStatus === SUCCESSFUL) {
    return (
      <div>
        {defaultContent}
      </div>
    );
  }

  // sequence status 'failed' and any other unexpected sequence status.
  return (
    <p className="text-center py-5 mx-auto" style={{ maxWidth: '30em' }}>
      {intl.formatMessage(messages.sequenceLoadFailure)}
    </p>
  );
};

Sequence.propTypes = {
  unitId: PropTypes.string,
  courseId: PropTypes.string.isRequired,
  sequenceId: PropTypes.string,
};

Sequence.defaultProps = {
  sequenceId: null,
  unitId: null,
};

export default injectIntl(Sequence);

import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { breakpoints, useWindowSize } from '@edx/paragon';
import { injectIntl } from '@edx/frontend-platform/i18n';

import Loading from '../../generic/Loading';
import SequenceNavigation from './sequence-navigation/SequenceNavigation';
import { RequestStatus } from '../../data/constants';

const Sequence = ({
  courseId,
  sequenceId,
  unitId,
}) => {
  const shouldDisplayNotificationTriggerInSequence = useWindowSize().width < breakpoints.small.minWidth;
  const sequenceStatus = useSelector(state => state.courseUnit.sequenceStatus);
  const sequenceMightBeUnit = useSelector(state => state.courseUnit.sequenceMightBeUnit);
  const TEST = useSelector(state => state);
  console.log('TEST', TEST);
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
  const loading = sequenceStatus === RequestStatus.IN_PROGRESS || (sequenceStatus === RequestStatus.FAILED && sequenceMightBeUnit);
  if (loading) {
    if (!sequenceId) {
      return (<div>There is no content here.</div>);
    }
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <Loading />;
  }

  if (sequenceStatus === RequestStatus.SUCCESSFUL) {
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
};

Sequence.defaultProps = {
  sequenceId: null,
  unitId: null,
};

export default injectIntl(Sequence);

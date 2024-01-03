import { useSelector } from 'react-redux';
import { useModel } from '../../generic/model-store';
import { sequenceIdsSelector } from '../data/selectors';

// eslint-disable-next-line import/prefer-default-export
export function useSequenceNavigationMetadata(currentSequenceId, currentUnitId) {
  // const sequenceIds = [
  //   'block-v1:edX+DemoX+Demo_Course+type@sequential+block@edx_introduction',
  //   'block-v1:edX+DemoX+Demo_Course+type@sequential+block@19a30717eff543078a5d94ae9d6c18a5',
  //   'block-v1:edX+DemoX+Demo_Course+type@sequential+block@basic_questions',
  //   'block-v1:edX+DemoX+Demo_Course+type@sequential+block@simulations',
  //   'block-v1:edX+DemoX+Demo_Course+type@sequential+block@graded_simulations',
  //   'block-v1:edX+DemoX+Demo_Course+type@sequential+block@175e76c4951144a29d46211361266e0e',
  //   'block-v1:edX+DemoX+Demo_Course+type@sequential+block@48ecb924d7fe4b66a230137626bfa93e',
  //   'block-v1:edX+DemoX+Demo_Course+type@sequential+block@dbe8fc027bcb4fe9afb744d2e8415855',
  //   'block-v1:edX+DemoX+Demo_Course+type@sequential+block@6ab9c442501d472c8ed200e367b4edfa',
  //   'block-v1:edX+DemoX+Demo_Course+type@sequential+block@workflow',
  // ];

  const sequenceIds = useSelector(sequenceIdsSelector);
  console.log('sequenceIds >>>>>>>>>>>>>>>>>>>>>>>', sequenceIds);
  const sequence = useModel('sequences', currentSequenceId);
  const { courseId, status } = useSelector(state => state.courseDetail);
  const courseStatus = status;
  const sequenceStatus = useSelector(state => state.courseUnit.sequenceStatus);

  // If we don't know the sequence and unit yet, then assume no.
  if (courseStatus !== 'successful' || sequenceStatus !== 'LOADED' || !currentSequenceId || !currentUnitId) {
    return { isFirstUnit: false, isLastUnit: false };
  }

  const sequenceIndex = sequenceIds.indexOf(currentSequenceId);
  // console.log('HELLOOOOOOOOOO', sequenceIndex);
  const unitIndex = sequence.unitIds.indexOf(currentUnitId);

  const isFirstSequence = sequenceIndex === 0;
  const isFirstUnitInSequence = unitIndex === 0;
  const isFirstUnit = isFirstSequence && isFirstUnitInSequence;
  const isLastSequence = sequenceIndex === sequenceIds.length - 1;
  const isLastUnitInSequence = unitIndex === sequence.unitIds.length - 1;
  const isLastUnit = isLastSequence && isLastUnitInSequence;

  const nextSequenceId = sequenceIndex < sequenceIds.length - 1 ? sequenceIds[sequenceIndex + 1] : null;
  const previousSequenceId = sequenceIndex > 0 ? sequenceIds[sequenceIndex - 1] : null;

  let nextLink;
  if (isLastUnit) {
    nextLink = `/course/${courseId}/course-end`;
  } else {
    const nextIndex = unitIndex + 1;
    if (nextIndex < sequence.unitIds.length) {
      const nextUnitId = sequence.unitIds[nextIndex];
      nextLink = `/course/${courseId}/container/${nextUnitId}/${currentSequenceId}`;
    } else if (nextSequenceId) {
      nextLink = `/course/${courseId}/container/${nextSequenceId}/first`;
    }
  }

  let previousLink;
  const previousIndex = unitIndex - 1;
  if (previousIndex >= 0) {
    const previousUnitId = sequence.unitIds[previousIndex];
    previousLink = `/course/${courseId}/container/${previousUnitId}/${currentSequenceId}`;
  } else if (previousSequenceId) {
    previousLink = `/course/${courseId}/${previousSequenceId}/last`;
  }

  return {
    isFirstUnit, isLastUnit, nextLink, previousLink,
  };
}

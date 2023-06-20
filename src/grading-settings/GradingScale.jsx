import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useRanger } from 'react-ranger';
import { Button, Icon, IconButton } from '@edx/paragon';
import { Add } from '@edx/paragon/icons';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

// eslint-disable-next-line react/prop-types
const GradingScale = ({ showSavePrompt }) => {
  const [gradingSegments, setGradingSegments] = useState([
    { current: 100, previous: 26 },
    { current: 26, previous: 0 },
  ]);
  const [gradeLetters, setGradeLetters] = useState(['A', 'B', 'C', 'D', 'F']);

  const addNewGradingSegment = () => {
    if (gradingSegments.length >= 5) {
      return;
    }

    setGradingSegments(prevValues => {
      const firstSegment = prevValues[prevValues.length - 1];
      const secondSegment = prevValues[prevValues.length - 2];
      const newCurrentValue = Math.ceil((secondSegment.current - secondSegment.previous) / 2);

      const newUpdatedSegment = {
        current: firstSegment.current + newCurrentValue,
        previous: firstSegment.current,
      };

      const updatedSecondSegment = {
        ...secondSegment,
        previous: firstSegment.current + newCurrentValue,
      };

      showSavePrompt(true);

      return [
        ...prevValues.slice(0, prevValues.length - 2),
        updatedSecondSegment,
        newUpdatedSegment,
        firstSegment,
      ];
    });
  };

  const updateGradingSegments = (newGradingSegmentData, activeHandleIndex) => {
    const gapToSegment = 1;
    const sortedSegments = newGradingSegmentData.sort((currentValue, previousValue) => currentValue - previousValue);
    const newSegmentValue = sortedSegments[sortedSegments.length - 1 - activeHandleIndex];
    const prevSegmentBoundary = (gradingSegments[activeHandleIndex + 1]
        && gradingSegments[activeHandleIndex + 1].current) || 0;
    const nextSegmentBoundary = gradingSegments[activeHandleIndex - 1].current;

    showSavePrompt(true);

    setGradingSegments(gradingSegments.map((gradingSegment, idx) => {
      const upperBoundaryValue = (newSegmentValue < nextSegmentBoundary - gapToSegment)
        ? newSegmentValue : (nextSegmentBoundary - gapToSegment);
      const lowerBoundaryValue = (upperBoundaryValue > prevSegmentBoundary + gapToSegment)
        ? upperBoundaryValue : (prevSegmentBoundary + gapToSegment);

      if (idx === activeHandleIndex - 1) {
        return {
          previous: lowerBoundaryValue,
          current: gradingSegment.current,
        };
      }

      if (idx === activeHandleIndex) {
        return {
          current: lowerBoundaryValue,
          previous: gradingSegment.previous,
        };
      }

      return gradingSegment;
    }));
  };

  const handleRemoveGradingSegment = (gradingSegmentIndex) => {
    setGradingSegments(prevValues => {
      const updatedSegments = [...prevValues];
      const removedSegment = updatedSegments.splice(gradingSegmentIndex - 1, 1)[0];
      const previousSegment = updatedSegments[gradingSegmentIndex - 2];

      if (previousSegment) {
        previousSegment.previous = removedSegment.previous;
      }

      return updatedSegments;
    });
  };

  const handleLetterChange = (e, idx) => {
    const { value } = e.target;
    setGradeLetters(prevValue => {
      const updatedLetters = [...prevValue];
      updatedLetters[idx - 1] = value;
      return updatedLetters;
    });
  };

  const {
    getTrackProps,
    ticks,
    segments,
    handles,
    activeHandleIndex,
  } = useRanger({
    min: 0,
    max: 100,
    stepSize: 1,
    values: gradingSegments.map(segment => segment.current),
    onDrag: (segmentDataArray) => updateGradingSegments(segmentDataArray, activeHandleIndex),
  });

  return (
    <div className="grading-scale">
      <IconButton
        className="mr-3"
        src={Add}
        iconAs={Icon}
        alt="Add new grading segment"
        onClick={addNewGradingSegment}
      />
      <div className="grading-scale-segments-and-ticks" {...getTrackProps()}>
        {ticks.map(({ value, getTickProps }) => (
          <div className="mt-5 grading-scale-tick" {...getTickProps()}>
            <div className="grading-scale-tick-number">{value}</div>
          </div>
        ))}
        {segments.reverse().map(({ value, getSegmentProps }, idx = 1) => (
          <div
            key={value}
            className={`grading-scale-segment segment-${idx - 1}`}
            {...getSegmentProps()}
          >
            <div className="grading-scale-segment-content">
              <input
                className="grading-scale-segment-content-title m-0"
                value={idx === 0 ? gradeLetters[0] : gradeLetters[idx - 1]}
                onChange={e => handleLetterChange(e, idx)}
                disabled={idx === gradingSegments.length}
              />
              <span className="grading-scale-segment-content-number m-0">
                {gradingSegments[idx === 0 ? 0 : idx - 1].previous} - {value}
              </span>
            </div>
            {idx !== gradingSegments.length && idx - 1 !== 0 && (
              <Button
                variant="link"
                size="inline"
                className="grading-scale-segment-btn-remove"
                type="button"
                onClick={() => handleRemoveGradingSegment(idx)}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        {handles.map(({ value, getHandleProps }, idx) => (
          <button
            key={value}
            className="grading-scale-segment-btn-resize"
            type="button"
            disabled={gradingSegments[idx].current === 100}
            {...getHandleProps({
              style: gradingSegments[idx].current === 100 ? { cursor: 'default', display: 'none' } : { cursor: 'e-resize' },
            })}
          />
        ))}
      </div>
    </div>
  );
};

GradingScale.propTypes = {
  intl: intlShape.isRequired,
  showSavePrompt: PropTypes.func.isRequired,
};

export default injectIntl(GradingScale);

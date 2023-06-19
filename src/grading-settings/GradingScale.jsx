import React, { useState } from 'react';
import { useRanger } from 'react-ranger';
import { Button, Icon, IconButton } from '@edx/paragon';
import { Add } from '@edx/paragon/icons';

const GradingScale = () => {
  const [gradingSegments, setGradingSegments] = useState([
    { current: 100, previous: 26 },
    { current: 26, previous: 0 },
  ]);

  const addNewGradingSegment = () => {
    setGradingSegments(prevValues => {
      const first = prevValues[prevValues.length - 1];
      const second = prevValues[prevValues.length - 2];

      const newCurrent = Math.ceil((second.current - second.previous) / 2);

      const newValue = {
        current: first.current + newCurrent,
        previous: first.current,
      };

      const updatedSecond = {
        ...second,
        previous: first.current + newCurrent,
      };

      return [
        ...prevValues.slice(0, prevValues.length - 2),
        updatedSecond,
        newValue,
        first,
      ];
    });
  };

  const updateGradingSegments = (newGradingSegmentData, activeHandleIndex) => {
    const sortedSegments = newGradingSegmentData.sort((a, b) => a - b);
    const newValue = sortedSegments[sortedSegments.length - 1 - activeHandleIndex];
    const prevSegmentBoundary = (gradingSegments[activeHandleIndex + 1]
        && gradingSegments[activeHandleIndex + 1].current) || 0;
    const nextSegmentBoundary = gradingSegments[activeHandleIndex - 1].current;

    setGradingSegments(gradingSegments.map((segment, idx) => {
      const upperBoundaryValue = newValue < nextSegmentBoundary - 5 ? newValue : nextSegmentBoundary - 5;
      const lowerBoundaryValue = upperBoundaryValue > prevSegmentBoundary + 5
        ? upperBoundaryValue : prevSegmentBoundary + 5;

      if (idx === activeHandleIndex - 1) {
        return { previous: lowerBoundaryValue, current: segment.current };
      }

      if (idx === activeHandleIndex) {
        return { current: lowerBoundaryValue, previous: segment.previous };
      }

      return segment;
    }));
  };

  const handleRemoveGradingSegment = (gradingSegmentIndex) => {
    setGradingSegments(prevValues => prevValues
      .filter((_, i) => i !== gradingSegmentIndex));
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
        {segments.map(({ value, getSegmentProps }, i) => (
          <div
            key={value}
            className={`grading-scale-segment segment-${i}`}
            {...getSegmentProps()}
          >
            <Button
              variant="link"
              size="inline"
              className="grading-scale-segment-btn-remove"
              type="button"
              onClick={() => handleRemoveGradingSegment(i)}
            >
              Remove
            </Button>
          </div>
        ))}
        {handles.map(({ value, getHandleProps }, i) => (
          <button
            key={value}
            className="grading-scale-segment-btn-resize"
            type="button"
            disabled={gradingSegments[i].current === 100}
            {...getHandleProps({
              style: gradingSegments[i].current === 100 ? { cursor: 'default' } : { cursor: 'e-resize' },
            })}
          >
            <div className="grading-scale-segment-content">
              <h4 className="grading-scale-segment-content-title handle-title m-0" contentEditable="true">
                {i}
              </h4>
              {gradingSegments[i].previous}-{value}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GradingScale;

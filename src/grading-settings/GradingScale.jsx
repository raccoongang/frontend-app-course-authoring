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
    setGradingSegments(prevValues => [
      ...prevValues,
      {
        current: prevValues[prevValues.length - 1].current + 15,
        previous: prevValues[prevValues.length - 1].current,
      },
    ]);
  };

  const updateGradingSegments = (newGradingSegmentData) => {
    setGradingSegments(prevValues => newGradingSegmentData.sort().map((newGradingSegmentValue, i) => ({
      current: newGradingSegmentValue,
      // eslint-disable-next-line no-nested-ternary
      previous: i === 0
        ? prevValues[newGradingSegmentData.length - 1].current : i === 1 ? 0 : prevValues[i - 1].current,
    })));
  };

  const handleRemoveGradingSegment = (gradingSegmentIndex) => {
    setGradingSegments(prevValues => prevValues
      .filter((_, i) => i !== gradingSegmentIndex));
  };

  const setGradingSegmentsValues = () => gradingSegments.map(segment => segment.current);

  const {
    getTrackProps,
    ticks,
    segments,
    handles,
  } = useRanger({
    min: 0,
    max: 100,
    stepSize: 1,
    values: setGradingSegmentsValues(),
    onDrag: updateGradingSegments,
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

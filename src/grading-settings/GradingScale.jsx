import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useRanger } from 'react-ranger';
import { Button, Icon, IconButton } from '@edx/paragon';
import { Add } from '@edx/paragon/icons';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

const GradingScale = ({
  showSavePrompt, gradeCutoffs, setShowSuccessAlert, setGradingData,
}) => {
  const titles = Object.keys(gradeCutoffs).map(letter => letter);
  const values = Object.values(gradeCutoffs).map(number => Math.round(number * 100));
  // const obj1 = [
  //   { current: 100, previous: 75 },
  //   { current: 75, previous: 63 },
  //   { current: 63, previous: 57 },
  //   { current: 57, previous: 50 },
  //   { current: 50, previous: 0 },
  // ];

  // const arr = [75, 63, 57, 50];

  const sortedGrades = values.reduce((result, current, index) => {
    if (index === (values.length - 1)) {
      result.push({ current: values[index - 1] || 100, previous: values[index] });
      result.push({ current: values[index], previous: 0 });
    } else if (index === 0) {
      result.push({ current: 100, previous: current });
    } else {
      const previous = values[index - 1];
      result.push({ current: previous, previous: current });
    }
    return result;
  }, []);

  const [gradingSegments, setGradingSegments] = useState(sortedGrades);
  const [gradeLetters, setGradeLetters] = useState(titles);

  const addNewGradingSegment = () => {
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

  const result = {};

  gradeLetters.forEach((letter, index) => {
    const value = gradingSegments[index].previous / 100;
    result[letter] = value;
  });

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
    onChange: () => {
      setShowSuccessAlert(false);
      setGradingData(prevData => ({
        ...prevData,
        gradeCutoffs: result,
      }));
    },
  });

  return (
    <div className="grading-scale">
      <IconButton
        disabled={gradingSegments.length >= 5}
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
              style: gradingSegments[idx].current === 100 ? {
                cursor: 'default', display: 'none',
              } : { cursor: 'e-resize' },
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
  // eslint-disable-next-line react/forbid-prop-types
  gradeCutoffs: PropTypes.object.isRequired,
  setShowSuccessAlert: PropTypes.func.isRequired,
  setGradingData: PropTypes.func.isRequired,
};

export default injectIntl(GradingScale);

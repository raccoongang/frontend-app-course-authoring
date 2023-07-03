import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRanger } from 'react-ranger';
import { Button, Icon, IconButton } from '@edx/paragon';
import { Add } from '@edx/paragon/icons';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import messages from './messages';
import {
  getGradingValues,
  getSortedGrades,
  getLettersOnLongScale,
  getLettersOnShortScale,
} from './utils';

const DEFAULT_LETTERS = ['A', 'B', 'C', 'D'];

const GradingScale = ({
  intl, showSavePrompt, gradingData, setShowSuccessAlert, setGradingData, resetDataRef,
}) => {
  const gradeCutoffs = gradingData?.gradeCutoffs;
  const gradeValues = getGradingValues(gradeCutoffs);
  const sortedGrades = getSortedGrades(gradeValues);

  const [gradingSegments, setGradingSegments] = useState(sortedGrades);
  const [letters, setLetters] = useState(Object.keys(gradeCutoffs));
  const [convertedResult, setConvertedResult] = useState({});

  useEffect(() => {
    if (resetDataRef.current) {
      setGradingSegments(sortedGrades);
      setLetters(Object.keys(gradeCutoffs));
      // eslint-disable-next-line no-param-reassign
      resetDataRef.current = false;
    }
  }, [gradeCutoffs]);

  useEffect(() => {
    setGradingData(prevData => ({
      ...prevData,
      gradeCutoffs: convertedResult,
    }));
  }, [convertedResult]);

  useEffect(() => {
    const convertedData = {};

    letters.forEach((letter, idx) => {
      convertedData[letter] = gradingSegments[idx].previous / 100;
    });

    setConvertedResult(convertedData);
  }, [gradingSegments, letters]);

  const addNewGradingSegment = () => {
    setGradingSegments(prevSegments => {
      const firstSegment = prevSegments[prevSegments.length - 1];
      const secondSegment = prevSegments[prevSegments.length - 2];
      const newCurrentValue = Math.ceil((secondSegment.current - secondSegment.previous) / 2);

      const newSegment = {
        current: (firstSegment.current + newCurrentValue),
        previous: firstSegment.current,
      };

      const updatedSecondSegment = {
        ...secondSegment,
        previous: (firstSegment.current + newCurrentValue),
      };

      showSavePrompt(true);
      setShowSuccessAlert(false);

      return [
        ...prevSegments.slice(0, prevSegments.length - 2),
        updatedSecondSegment,
        newSegment,
        firstSegment,
      ];
    });

    const nextIndex = (letters.length % DEFAULT_LETTERS.length);

    if (gradingSegments.length === 2) {
      setLetters([DEFAULT_LETTERS[0], DEFAULT_LETTERS[nextIndex]]);
    } else {
      setLetters(prevLetters => [...prevLetters, DEFAULT_LETTERS[nextIndex]]);
    }
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

  const removeGradingSegment = (gradingSegmentIndex) => {
    setGradingSegments(prevSegments => {
      const updatedSegments = [...prevSegments];
      const removedSegment = updatedSegments.splice(gradingSegmentIndex - 1, 1)[0];
      const previousSegment = updatedSegments[gradingSegmentIndex - 2];

      if (previousSegment) {
        previousSegment.previous = removedSegment.previous;
      }

      return updatedSegments;
    });

    showSavePrompt(true);
    setShowSuccessAlert(false);
    setLetters(prevLetters => {
      const updatedLetters = [...prevLetters];
      updatedLetters.splice(updatedLetters.length - 1, 1);
      return updatedLetters.length === 1 ? ['pass'] : updatedLetters;
    });
  };

  const handleLetterChange = (e, idx) => {
    const { value } = e.target;
    showSavePrompt(true);
    setShowSuccessAlert(false);
    setLetters(prevLetters => {
      const updatedLetters = [...prevLetters];
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
    onChange: () => {
      setShowSuccessAlert(false);
      setGradingData(prevData => ({
        ...prevData,
        gradeCutoffs: convertedResult,
      }));
    },
  });

  return (
    <div className="grading-scale">
      <IconButton
        disabled={gradingSegments.length >= 5}
        data-testid="grading-scale-btn-add-segment"
        className="mr-3"
        src={Add}
        iconAs={Icon}
        alt={intl.formatMessage(messages.addNewSegmentButtonAltText)}
        onClick={addNewGradingSegment}
      />
      <div className="grading-scale-segments-and-ticks" {...getTrackProps()}>
        {ticks.map(({ value, getTickProps }) => (
          <div className="mt-5 grading-scale-tick" data-testid="grading-scale-tick" {...getTickProps()}>
            <div className="grading-scale-tick-number">{value}</div>
          </div>
        ))}
        {segments.reverse().map(({ value, getSegmentProps }, idx = 1) => (
          <div
            key={value}
            className={`grading-scale-segment segment-${idx - 1}`}
            data-testid="grading-scale-segment"
            {...getSegmentProps()}
          >
            <div className="grading-scale-segment-content">
              {gradingSegments.length === 2 && (
                <input
                  className="grading-scale-segment-content-title m-0"
                  data-testid="grading-scale-segment-input"
                  value={getLettersOnShortScale(idx, letters)}
                  onChange={e => handleLetterChange(e, idx)}
                  disabled={idx === gradingSegments.length}
                />
              )}
              {gradingSegments.length > 2 && (
                <input
                  className="grading-scale-segment-content-title m-0"
                  data-testid="grading-scale-segment-input"
                  value={getLettersOnLongScale(idx, letters, gradingSegments)}
                  onChange={e => handleLetterChange(e, idx)}
                  disabled={idx === gradingSegments.length}
                />
              )}
              <span className="grading-scale-segment-content-number m-0">
                {gradingSegments[idx === 0 ? 0 : idx - 1]?.previous} - {value}
              </span>
            </div>
            {idx !== gradingSegments.length && idx - 1 !== 0 && (
              <Button
                variant="link"
                size="inline"
                className="grading-scale-segment-btn-remove"
                data-testid="grading-scale-btn-remove"
                type="button"
                onClick={() => removeGradingSegment(idx)}
              >
                {intl.formatMessage(messages.removeSegmentButtonText)}
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
  gradingData: PropTypes.shape({
    gradeCutoffs: PropTypes.objectOf(PropTypes.number),
  }).isRequired,
  setShowSuccessAlert: PropTypes.func.isRequired,
  setGradingData: PropTypes.func.isRequired,
  resetDataRef: PropTypes.bool.isRequired,
};

export default injectIntl(GradingScale);

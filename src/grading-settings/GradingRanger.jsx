import React, { useState } from 'react';
import { useRanger } from 'react-ranger';
import { IconButton, Icon } from '@edx/paragon';
import { Add } from '@edx/paragon/icons';

const GradingRanger = () => {
    const [values, setValues] = useState([15, 50, 80]);

    const handleClick = () => {
        setValues(prevValues => [...prevValues, 5]);
    };

    const {
        getTrackProps,
        ticks,
        segments,
        handles,
    } = useRanger({
        min: 0,
        max: 100,
        stepSize: 1,
        values,
        onDrag: setValues,
    });

    return (
      <div className="ranger">
        <IconButton
          className="mr-3"
          src={Add}
          iconAs={Icon}
          alt="Add"
          onClick={handleClick}
        />
        <div className="ranger-track" {...getTrackProps()}>
          {ticks.map(({ value, getTickProps }) => (
            <div className="mt-5 ranger-tick" {...getTickProps()}>
              <div className="ranger-tick-label">{value}</div>
            </div>
                ))}
          {segments.map(({ getSegmentProps }, i) => (
            <div className="range-item">
              <div
                className={`ranger-segment segment-${i}`}
                {...getSegmentProps()}
              />
            </div>
                ))}
          {/* eslint-disable-next-line no-unused-vars */}
          {handles.map(({ value, active, getHandleProps }) => (
            <button
              className="ranger-btn"
              type="button"
              {...getHandleProps({ style: { cursor: 'e-resize' } })}
            >
              <div className="handle">
                <h4 className="handle-title m-0" contentEditable="true">A</h4>
                0-{value}
              </div>
            </button>
                ))}
        </div>
      </div>
    );
};

export default GradingRanger;

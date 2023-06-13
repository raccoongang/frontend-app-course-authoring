import React, { useState } from 'react';
import { useRanger } from 'react-ranger';
import { IconButton, Icon } from '@edx/paragon';
import { Add } from '@edx/paragon/icons';
// eslint-disable
const GradingRanger = () => {
    const [values, setValues] = useState([
        { current: 100, previous: 26 },
        { current: 26, previous: 0 },
    ]);

    const [letters, setLetters] = useState(['A', 'B']);

    const handleClick = () => {
        if (letters.length < 5) {
            const newLetter = String.fromCharCode(letters.length + 65); // Start from ASCII code 65 (A)
            setLetters(prevLetters => [...prevLetters, newLetter]);
            setValues(prevValues => [
                ...prevValues,
                { current: 26, previous: prevValues[prevValues.length - 1].current },
            ]);
        }
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
        values: values.map(item => item.current),
        // eslint-disable-next-line no-unused-vars
        onDrag: (newValues, activeIndex) => {
            setValues(prevValues => newValues.map((newValue, index) => ({
                    current: newValue,
                // eslint-disable-next-line no-nested-ternary
                    previous: index === 0 ? prevValues[index].previous
                        : (index === values.length - 1 ? 0 : prevValues[index - 1].current),
                })));
        },
    });

    const handleRemove = (index) => {
        setLetters(prevLetters => prevLetters.filter((_, i) => i !== index));
        setValues(prevValues => prevValues.filter((_, i) => i !== index));
    };

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
              // eslint-disable-next-line react/no-array-index-key
            <div className="range-item" key={i}>
              <div
                className={`ranger-segment segment-${i}`}
                {...getSegmentProps()}
              />
            </div>
                ))}
          {handles.map(({ value, getHandleProps }, index) => (
            <div key={value} className="ranger-btn-wrapper">
              <button
                className="ranger-btn"
                type="button"
                {...getHandleProps({ style: { cursor: 'e-resize' } })}
              >
                <div className="handle">
                  <button type="button" onClick={() => handleRemove(index)}>
                    Remove
                  </button>
                  <h4 className="handle-title m-0" contentEditable="true">
                    {letters[index]}
                  </h4>
                  {values[index].previous}-{value}
                </div>
              </button>
            </div>
                ))}
        </div>
      </div>
    );
};

export default GradingRanger;

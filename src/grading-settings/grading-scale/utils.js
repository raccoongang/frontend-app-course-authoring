import { capitalize } from 'lodash';

export const getGradingValues = (cutoffs) => Object.values(cutoffs).map(number => Math.round(number * 100));

export const getSortedGrades = (gradeValues) => gradeValues.reduce((sortedArray, current, idx) => {
  if (idx === (gradeValues.length - 1)) {
    sortedArray.push({ current: gradeValues[idx - 1] || 100, previous: gradeValues[idx] });
    sortedArray.push({ current: gradeValues[idx], previous: 0 });
  } else if (idx === 0) {
    sortedArray.push({ current: 100, previous: current });
  } else {
    const previous = gradeValues[idx - 1];
    sortedArray.push({ current: previous, previous: current });
  }
  return sortedArray;
}, []);

export const getLettersOnLongScale = (idx, letters, gradingSegments) => {
  if (idx === 0) {
    return letters[0];
  }
  if ((idx - 1) === (gradingSegments.length - 1)) {
    return 'F';
  }
  return capitalize(letters[idx - 1]);
};

export const getLettersOnShortScale = (idx, letters) => (idx === 1 ? capitalize(letters[idx - 1]) : 'Fail');

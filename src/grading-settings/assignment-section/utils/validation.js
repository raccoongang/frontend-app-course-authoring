/**
 * Validates assignment fields, updates error list and save prompt visibility accordingly.
 *
 * @param {number} id - Element id.
 * @param {string} name - The name of the field being validated.
 * @param {string} type - The type of the assignment.
 * @param {string} value - The value of the field being validated.
 * @param {function} setErrorList - Function to update the error list state.
 * @param {function} setShowSavePrompt - Function to update the visibility of the save prompt.
 * @param {array} graders - An array of existing grading data.
 * @param {number} weight - The weight of the assignment.
 * @param {number} minCount - The minimum count of the assignment.
 * @param {number} dropCount - The drop count of the assignment.
 * @returns {void}
 */
// eslint-disable-next-line import/prefer-default-export
export const validationAssignmentFields = (
  id,
  name,
  type,
  value,
  setErrorList,
  setShowSavePrompt,
  graders,
  weight,
  minCount,
  dropCount,
) => {
  const gradingTypes = graders?.map(grade => grade.type);
  setErrorList({});

  switch (name) {
  case type:
    if (value === '') {
      setErrorList(prevState => ({ ...prevState, [name]: true }));
      setShowSavePrompt(false);
      return;
    }
    if (gradingTypes.includes(value)) {
      setErrorList(prevState => ({ ...prevState, [value]: 'duplicate' }));
      setShowSavePrompt(false);
    }
    break;

  case weight:
    if (value < 0 || value > 100 || value === '-0') {
      setErrorList(prevState => ({ ...prevState, [`${name}-${id}`]: true }));
      setShowSavePrompt(false);
    }
    break;

  case minCount:
    if (value <= 0 || value === '' || value === '-0') {
      setErrorList(prevState => ({ ...prevState, [`${name}-${id}`]: true }));
      setShowSavePrompt(false);
    }
    break;

  case dropCount:
    if (value < 0 || value === '' || value === '-0') {
      setErrorList(prevState => ({ ...prevState, [`${name}-${id}`]: true }));
      setShowSavePrompt(false);
    }
    break;

  default:
    setErrorList(prevState => ({ ...prevState, [name]: false }));
  }
};

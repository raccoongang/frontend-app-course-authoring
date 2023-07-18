import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import AssignmentSection from '.';
import messages from './messages';

const defaultAssignments = {
  type: 'Test type',
  minCount: 1,
  dropCount: 1,
  shortLabel: 'TT',
  weight: 100,
  id: 0,
};

const RootWrapper = () => (
  <IntlProvider locale="en">
    <AssignmentSection
      handleRemoveAssignment={jest.fn()}
      setShowSavePrompt={jest.fn()}
      graders={[defaultAssignments]}
      setGradingData={jest.fn()}
      courseAssignmentLists={defaultAssignments}
      setShowSuccessAlert={jest.fn()}
    />
  </IntlProvider>
);

describe('<AssignmentSection />', () => {
  it('checking the correct display of titles, labels, descriptions', async () => {
    const { getByText } = render(<RootWrapper />);
    await waitFor(() => {
      expect(getByText(messages.assignmentTypeNameTitle.defaultMessage)).toBeInTheDocument();
      expect(getByText(messages.assignmentTypeNameDescription.defaultMessage)).toBeInTheDocument();
      expect(getByText(messages.abbreviationTitle.defaultMessage)).toBeInTheDocument();
      expect(getByText(messages.abbreviationDescription.defaultMessage)).toBeInTheDocument();
      expect(getByText(messages.weightOfTotalGradeTitle.defaultMessage)).toBeInTheDocument();
      expect(getByText(messages.weightOfTotalGradeDescription.defaultMessage)).toBeInTheDocument();
      expect(getByText(messages.totalNumberTitle.defaultMessage)).toBeInTheDocument();
      expect(getByText(messages.totalNumberDescription.defaultMessage)).toBeInTheDocument();
      expect(getByText(messages.numberOfDroppableTitle.defaultMessage)).toBeInTheDocument();
      expect(getByText(messages.numberOfDroppableDescription.defaultMessage)).toBeInTheDocument();
      expect(getByText(messages.assignmentAlertWarningDescription.defaultMessage)).toBeInTheDocument();
      expect(getByText(messages.assignmentDeleteButton.defaultMessage)).toBeInTheDocument();
      expect(getByText('Warning: The number of Test type assignments defined here does not match the current number of Test type assignments in the course:')).toBeInTheDocument();
    });
  });
  it('checking correct assignment abbreviation value', () => {
    const { getByTestId } = render(<RootWrapper />);
    const assignmentShortLabelInput = getByTestId('assignment-shortLabel-input');
    expect(assignmentShortLabelInput.value).toBe('TT');
  });
  it('checking correct assignment weight of total grade value', async () => {
    const { getByTestId } = render(<RootWrapper />);
    await waitFor(() => {
      const assignmentShortLabelInput = getByTestId('assignment-weight-input');
      expect(assignmentShortLabelInput.value).toBe('100');
    });
  });
  it('checking correct assignment total number value', async () => {
    const { getByTestId } = render(<RootWrapper />);
    await waitFor(() => {
      const assignmentTotalNumberInput = getByTestId('assignment-minCount-input');
      expect(assignmentTotalNumberInput.value).toBe('1');
    });
  });
  it('checking correct assignment number of droppable value', async () => {
    const { getByTestId } = render(<RootWrapper />);
    await waitFor(() => {
      const assignmentNumberOfDroppableInput = getByTestId('assignment-dropCount-input');
      expect(assignmentNumberOfDroppableInput.value).toBe('1');
    });
  });
});

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import CourseUpdate from './CourseUpdate';
import messages from '../messages';

const onEditMock = jest.fn();
const onDeleteMock = jest.fn();
const updateDate = 'May 1, 2023';
const updateContent = 'Update Content';

const RootWrapper = () => (
  <IntlProvider locale="en">
    <CourseUpdate
      updateDate={updateDate}
      updateContent={updateContent}
      onEdit={onEditMock}
      onDelete={onDeleteMock}
    />
  </IntlProvider>
);

describe('<CourseUpdate />', () => {
  it('render CourseUpdate component correctly', () => {
    const { getByText } = render(<RootWrapper />);

    expect(getByText(updateDate)).toBeInTheDocument();
    expect(getByText(updateContent)).toBeInTheDocument();
    expect(getByText(messages.buttons.edit.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.buttons.delete.defaultMessage)).toBeInTheDocument();
  });

  it('calls Edit and Delete buttons is clicked', () => {
    const { getByText } = render(<RootWrapper />);

    const editButton = getByText(messages.buttons.edit.defaultMessage);
    fireEvent.click(editButton);
    expect(onEditMock).toHaveBeenCalledTimes(1);

    const deleteButton = getByText(messages.buttons.delete.defaultMessage);
    fireEvent.click(deleteButton);
    expect(onDeleteMock).toHaveBeenCalledTimes(1);
  });
});

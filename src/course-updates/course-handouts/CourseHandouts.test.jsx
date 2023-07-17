import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import CourseHandouts from './CourseHandouts';
import messages from '../messages';

const onEditMock = jest.fn();
const handoutsContent = 'Handouts Content';

const RootWrapper = () => (
  <IntlProvider locale="en">
    <CourseHandouts
      isExample
      handoutsContent={handoutsContent}
      onEdit={onEditMock}
    />
  </IntlProvider>
);

describe('<CourseHandouts />', () => {
  it('render CourseHandouts component correctly', () => {
    const { getByText } = render(<RootWrapper />);

    expect(getByText(messages.handoutsTitle.defaultMessage)).toBeInTheDocument();
    expect(getByText(handoutsContent)).toBeInTheDocument();
    expect(getByText(messages.editButton.defaultMessage)).toBeInTheDocument();
  });

  it('calls Edit button is clicked', () => {
    const { getByText } = render(<RootWrapper />);

    const editButton = getByText(messages.editButton.defaultMessage);
    fireEvent.click(editButton);
    expect(onEditMock).toHaveBeenCalledTimes(1);
  });
});

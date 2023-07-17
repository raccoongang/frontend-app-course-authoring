import React from 'react';
import {
  render, fireEvent, waitFor,
} from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import moment from 'moment/moment';
import PropTypes from 'prop-types';
import UpdateModal from './UpdateModal';
import messages from '../messages';
import { requestTypes } from '../constants';
import { courseHandoutsMock, courseUpdatesMock } from '../__mocks__';

const closeMock = jest.fn();
const onSubmitMock = jest.fn();

const addNewUpdateMock = { id: 0, date: moment().utc().toDate(), content: 'Some content' };

const courseUpdatesInitialValues = (requestType) => {
  switch (requestType) {
  case requestTypes.add_new_update:
    return addNewUpdateMock;
  case requestTypes.edit_update:
    return courseUpdatesMock[0];
  default:
    return courseHandoutsMock;
  }
};

const RootWrapper = ({ requestType }) => (
  <IntlProvider locale="en">
    <UpdateModal
      isOpen
      close={closeMock}
      requestType={requestType}
      onSubmit={onSubmitMock}
      courseUpdatesInitialValues={courseUpdatesInitialValues(requestType)}
    />
  </IntlProvider>
);

RootWrapper.propTypes = {
  requestType: PropTypes.string.isRequired,
};

describe('<UpdateModal />', () => {
  it('render UpdateModal component default correctly', () => {
    const { getByText, getByRole } = render(<RootWrapper requestType={requestTypes.add_new_update} />);

    const cancelButton = getByText(messages.cancelButton.defaultMessage);
    fireEvent.click(cancelButton);
    const closeButton = getByRole('button', { name: 'Close' });
    fireEvent.click(closeButton);
    expect(closeMock).toHaveBeenCalledTimes(2);
  });

  it('render Add new update modal correctly', async () => {
    const { getByText, getByDisplayValue } = render(<RootWrapper requestType={requestTypes.add_new_update} />);
    const { date } = courseUpdatesInitialValues(requestTypes.add_new_update);
    const formattedDate = moment(date).utc().format('MM/DD/yyyy');

    expect(getByText(messages.addNewUpdateTitle.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.updateModalDate.defaultMessage)).toBeInTheDocument();
    expect(getByDisplayValue(formattedDate)).toBeInTheDocument();

    const postButton = getByText(messages.postButton.defaultMessage);
    fireEvent.click(postButton);
    await waitFor(() => expect(onSubmitMock).toHaveBeenCalledTimes(1));
  });

  it('render Edit updates modal correctly', async () => {
    const { getByText, getByDisplayValue } = render(<RootWrapper requestType={requestTypes.edit_update} />);
    const { date } = courseUpdatesInitialValues(requestTypes.edit_update);
    const formattedDate = moment(date).format('MM/DD/yyyy');

    expect(getByText(messages.editUpdateTitle.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.updateModalDate.defaultMessage)).toBeInTheDocument();
    expect(getByDisplayValue(formattedDate)).toBeInTheDocument();

    const postButton = getByText(messages.postButton.defaultMessage);
    fireEvent.click(postButton);
    await waitFor(() => expect(onSubmitMock).toHaveBeenCalledTimes(1));
  });

  it('render Edit handouts modal correctly', async () => {
    const { getByText } = render(<RootWrapper requestType={requestTypes.edit_handouts} />);

    expect(getByText(messages.editHandoutsTitle.defaultMessage)).toBeInTheDocument();

    const saveButton = getByText(messages.saveButton.defaultMessage);
    fireEvent.click(saveButton);
    await waitFor(() => expect(onSubmitMock).toHaveBeenCalledTimes(3));
  });
});

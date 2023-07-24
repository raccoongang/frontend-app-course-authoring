import React from 'react';
import {
  render,
} from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import moment from 'moment/moment';

import UpdateModal from './UpdateModal';
import messages from './messages';
import { REQUEST_TYPES } from '../constants';
import { courseHandoutsMock, courseUpdatesMock } from '../__mocks__';

const closeMock = jest.fn();
const onSubmitMock = jest.fn();
const addNewUpdateMock = { id: 0, date: moment().utc().toDate(), content: 'Some content' };

// Mock the tinymce lib
jest.mock('@tinymce/tinymce-react', () => {
  const originalModule = jest.requireActual('@tinymce/tinymce-react');
  return {
    __esModule: true,
    ...originalModule,
    Editor: () => 'foo bar',
  };
});

// Mock the TinyMceWidget from frontend-lib-content-components
jest.mock('@edx/frontend-lib-content-components', () => ({
  TinyMceWidget: () => <div>Widget</div>,
  prepareEditorRef: jest.fn(() => ({
    refReady: true,
    setEditorRef: jest.fn().mockName('prepareEditorRef.setEditorRef'),
  })),
}));

const courseUpdatesInitialValues = (requestType) => {
  switch (requestType) {
  case REQUEST_TYPES.add_new_update:
    return addNewUpdateMock;
  case REQUEST_TYPES.edit_update:
    return courseUpdatesMock[0];
  default:
    return courseHandoutsMock;
  }
};

const renderComponent = ({ requestType }) => render(
  <IntlProvider locale="en">
    <UpdateModal
      isOpen
      close={closeMock}
      requestType={requestType}
      onSubmit={onSubmitMock}
      courseUpdatesInitialValues={courseUpdatesInitialValues(requestType)}
    />
  </IntlProvider>,
);

describe('<UpdateModal />', () => {
  it('render Add new update modal correctly', async () => {
    const { getByText, getByDisplayValue, getByRole } = renderComponent({ requestType: REQUEST_TYPES.add_new_update });
    const { date } = courseUpdatesInitialValues(REQUEST_TYPES.add_new_update);
    const formattedDate = moment(date).utc().format('MM/DD/yyyy');

    expect(getByText(messages.addNewUpdateTitle.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.updateModalDate.defaultMessage)).toBeInTheDocument();
    expect(getByDisplayValue(formattedDate)).toBeInTheDocument();
    expect(getByRole('button', { name: messages.cancelButton.defaultMessage }));
    expect(getByRole('button', { name: messages.postButton.defaultMessage }));
  });
});

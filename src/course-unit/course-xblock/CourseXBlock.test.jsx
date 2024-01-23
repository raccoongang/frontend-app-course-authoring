import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { initializeMockApp } from '@edx/frontend-platform';
import { AppProvider } from '@edx/frontend-platform/react';

import { courseVerticalChildrenMock } from '../__mocks__';
import CourseXBlock from './CourseXBlock';

import messages from './messages';
import deleteModalMessages from '../../generic/delete-modal/messages';

let store;
const handleDeleteMock = jest.fn();
const handleDuplicateMock = jest.fn();
const XblockData = courseVerticalChildrenMock.children[0];
const unitXBlockActionsMock = {
  handleDelete: handleDeleteMock,
  handleDuplicate: handleDuplicateMock,
};

const renderComponent = () => render(
  <AppProvider store={store}>
    <IntlProvider locale="en">
      <CourseXBlock
        id={XblockData.block_id}
        title={XblockData.block_id}
        unitXBlockActions={unitXBlockActionsMock}
        shouldScroll={false}
      />
    </IntlProvider>
  </AppProvider>,
);

describe('<CourseXBlock />', () => {
  beforeEach(async () => {
    initializeMockApp({
      authenticatedUser: {
        userId: 3,
        username: 'abc123',
        administrator: true,
        roles: [],
      },
    });
  });

  it('render CourseXBlock component correctly', async () => {
    const { getByText, getByLabelText } = renderComponent();

    await waitFor(() => {
      expect(getByText(XblockData.block_id)).toBeInTheDocument();
      expect(getByLabelText(messages.blockAltButtonEdit.defaultMessage)).toBeInTheDocument();
      expect(getByLabelText(messages.blockActionsDropdownAlt.defaultMessage)).toBeInTheDocument();
    });
  });

  it('render CourseXBlock component action dropdown correctly', async () => {
    const { getByText, getByLabelText } = renderComponent();

    await waitFor(() => {
      userEvent.click(getByLabelText(messages.blockActionsDropdownAlt.defaultMessage));
      expect(getByText(messages.blockLabelButtonCopy.defaultMessage)).toBeInTheDocument();
      expect(getByText(messages.blockLabelButtonDuplicate.defaultMessage)).toBeInTheDocument();
      expect(getByText(messages.blockLabelButtonMove.defaultMessage)).toBeInTheDocument();
      expect(getByText(messages.blockLabelButtonManageAccess.defaultMessage)).toBeInTheDocument();
      expect(getByText(messages.blockLabelButtonDelete.defaultMessage)).toBeInTheDocument();
    });
  });

  it('calls handleDuplicate when item is clicked', async () => {
    const { getByText, getByLabelText } = renderComponent();

    await waitFor(() => {
      userEvent.click(getByLabelText(messages.blockActionsDropdownAlt.defaultMessage));
      const duplicateBtn = getByText(messages.blockLabelButtonDuplicate.defaultMessage);

      userEvent.click(duplicateBtn);
      expect(handleDuplicateMock).toHaveBeenCalledTimes(1);
      expect(handleDuplicateMock).toHaveBeenCalledWith(XblockData.block_id);
    });
  });

  it('opens confirm delete modal and calls handleDelete when deleting was confirmed', async () => {
    const { getByText, getByLabelText, getByRole } = renderComponent();

    await waitFor(() => {
      userEvent.click(getByLabelText(messages.blockActionsDropdownAlt.defaultMessage));
      const deleteBtn = getByText(messages.blockLabelButtonDelete.defaultMessage);

      userEvent.click(deleteBtn);
      expect(getByText(/Delete this component?/)).toBeInTheDocument();
      expect(getByText(/Deleting this component is permanent and cannot be undone./)).toBeInTheDocument();
      expect(getByRole('button', { name: deleteModalMessages.cancelButton.defaultMessage })).toBeInTheDocument();
      expect(getByRole('button', { name: deleteModalMessages.deleteButton.defaultMessage })).toBeInTheDocument();

      userEvent.click(getByRole('button', { name: deleteModalMessages.cancelButton.defaultMessage }));
      expect(handleDeleteMock).not.toHaveBeenCalled();

      userEvent.click(getByText(messages.blockLabelButtonDelete.defaultMessage));
      expect(getByText(/Delete this component?/)).toBeInTheDocument();

      userEvent.click(deleteBtn);
      userEvent.click(getByRole('button', { name: deleteModalMessages.deleteButton.defaultMessage }));
      expect(handleDeleteMock).toHaveBeenCalled();
      expect(handleDeleteMock).toHaveBeenCalledWith(XblockData.block_id);
    });
  });
});

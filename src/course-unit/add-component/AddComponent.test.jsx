import MockAdapter from 'axios-mock-adapter';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { initializeMockApp } from '@edx/frontend-platform';
import { AppProvider } from '@edx/frontend-platform/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { capitalize } from 'lodash';
import initializeStore from '../../store';
import { executeThunk } from '../../utils';
import { fetchAdvancedSettingsModules, fetchCourseSectionVerticalData } from '../data/thunk';
import { getAdvancedSettingsModules, getCourseSectionVerticalApiUrl } from '../data/api';
import { courseSectionVerticalMock } from '../__mocks__';
import AddComponent from './AddComponent';
import messages from './messages';

let store;
let axiosMock;
const blockId = '123';
const handleCreateNewCourseXblockMock = jest.fn();

const advancedSettingsModulesMock = {
  advanced_modules: {
    value: ['annotatable', 'word_cloud', 'split_test'],
    display_name: 'Advanced Module List',
    help: 'Enter the names of the advanced modules to use in your course.',
    deprecated: false,
    hide_on_enabled_publisher: false,
  },
};

const renderComponent = (props) => render(
  <AppProvider store={store}>
    <IntlProvider locale="en">
      <AddComponent
        blockId={blockId}
        handleCreateNewCourseXblock={handleCreateNewCourseXblockMock}
        {...props}
      />
    </IntlProvider>
  </AppProvider>,
);

describe('<AddComponent />', () => {
  beforeEach(async () => {
    initializeMockApp({
      authenticatedUser: {
        userId: 3,
        username: 'abc123',
        administrator: true,
        roles: [],
      },
    });

    store = initializeStore();
    axiosMock = new MockAdapter(getAuthenticatedHttpClient());
    axiosMock
      .onGet(getCourseSectionVerticalApiUrl(blockId))
      .reply(200, courseSectionVerticalMock);
    axiosMock
      .onGet(getAdvancedSettingsModules(blockId))
      .reply(200, advancedSettingsModulesMock);
    await executeThunk(fetchCourseSectionVerticalData(blockId), store.dispatch);
    await executeThunk(fetchAdvancedSettingsModules(blockId), store.dispatch);
  });

  it('render AddComponent component correctly', () => {
    const { getByRole } = renderComponent();
    const componentTemplates = courseSectionVerticalMock.component_templates;

    expect(getByRole('heading', { name: messages.title.defaultMessage })).toBeInTheDocument();
    Object.keys(componentTemplates).map((component) => (
      expect(getByRole('button', {
        name: new RegExp(`${messages.buttonText.defaultMessage} ${componentTemplates[component].display_name}`, 'i'),
      })).toBeInTheDocument()
    ));
  });

  it('create new "Discussion" xblock on click', () => {
    const { getByRole } = renderComponent();

    const discussionButton = getByRole('button', {
      name: new RegExp(`${messages.buttonText.defaultMessage} Discussion`, 'i'),
    });

    userEvent.click(discussionButton);
    expect(handleCreateNewCourseXblockMock).toHaveBeenCalled();
    expect(handleCreateNewCourseXblockMock).toHaveBeenCalledWith({
      parentLocator: '123',
      type: 'discussion',
    });
  });

  it('create new "Drag and Drop" xblock on click', () => {
    const { getByRole } = renderComponent();

    const discussionButton = getByRole('button', {
      name: new RegExp(`${messages.buttonText.defaultMessage} Drag and Drop`, 'i'),
    });

    userEvent.click(discussionButton);
    expect(handleCreateNewCourseXblockMock).toHaveBeenCalled();
    expect(handleCreateNewCourseXblockMock).toHaveBeenCalledWith({
      parentLocator: '123',
      type: 'drag-and-drop-v2',
    });
  });

  it('should open advanced settings modal and display advanced module list', async () => {
    const { getByRole, getByText } = renderComponent();
    const advancedButton = getByRole('button', {
      name: new RegExp(`${messages.buttonText.defaultMessage} Advanced`, 'i'),
    });

    userEvent.click(advancedButton);
    await waitFor(() => {
      expect(getByText(messages.advancedModalTitle.defaultMessage)).toBeInTheDocument();
      expect(getByText(messages.modalContainerCancelBtnText.defaultMessage)).toBeInTheDocument();
      expect(getByText(messages.advancedModalBtnText.defaultMessage)).toBeInTheDocument();

      advancedSettingsModulesMock.advanced_modules.value.forEach((module) => {
        const formattedModuleTitle = capitalize(module.replace(/_/g, ' '));
        expect(formattedModuleTitle).toBeInTheDocument();
      });
    });
  });

  it('should trigger the creation of new course XBlocks for each selected advanced module', async () => {
    const { getByRole, getByText } = renderComponent();
    const advancedButton = getByRole('button', {
      name: new RegExp(`${messages.buttonText.defaultMessage} Advanced`, 'i'),
    });

    userEvent.click(advancedButton);
    await waitFor(() => {
      advancedSettingsModulesMock
        .advanced_modules.value
        .forEach((module) => {
          const formattedModuleTitle = capitalize(module.replace(/_/g, ' '));
          const moduleRadioButtons = getByText(formattedModuleTitle);
          userEvent.click(moduleRadioButtons);

          expect(handleCreateNewCourseXblockMock).toHaveBeenCalled();
          expect(handleCreateNewCourseXblockMock).toHaveBeenCalledWith({
            type: module,
            category: 'advanced',
            parentLocator: blockId,
          });
        });
    });
  });
});

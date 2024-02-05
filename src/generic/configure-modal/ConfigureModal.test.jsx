import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { initializeMockApp } from '@edx/frontend-platform';
import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { AppProvider } from '@edx/frontend-platform/react';

import initializeStore from '../../store';
import ConfigureModal from './ConfigureModal';
import {
  currentSectionMock,
  currentSubsectionMock,
  currentUnitMock,
  currentXBlockMock,
} from './__mocks__';
import messages from './messages';

// eslint-disable-next-line no-unused-vars
let axiosMock;
let store;
const mockPathname = '/foo-bar';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: mockPathname,
  }),
}));

const onCloseMock = jest.fn();
const onConfigureSubmitMock = jest.fn();

const renderComponent = () => render(
  <AppProvider store={store}>
    <IntlProvider locale="en">
      <ConfigureModal
        isOpen
        onClose={onCloseMock}
        onConfigureSubmit={onConfigureSubmitMock}
        currentItemData={currentSectionMock}
      />
    </IntlProvider>,
  </AppProvider>,
);

describe('<ConfigureModal /> for Section', () => {
  beforeEach(() => {
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
  });

  it('renders ConfigureModal component correctly', () => {
    const { getByText, getByRole } = renderComponent();
    expect(getByText(`${currentSectionMock.displayName} Settings`)).toBeInTheDocument();
    expect(getByText(messages.basicTabTitle.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.visibilityTabTitle.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.releaseDate.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.releaseTimeUTC.defaultMessage)).toBeInTheDocument();
    expect(getByRole('button', { name: messages.cancelButton.defaultMessage })).toBeInTheDocument();
    expect(getByRole('button', { name: messages.saveButton.defaultMessage })).toBeInTheDocument();
  });

  it('switches to the Visibility tab and renders correctly', () => {
    const { getByRole, getByText } = renderComponent();

    const visibilityTab = getByRole('tab', { name: messages.visibilityTabTitle.defaultMessage });
    userEvent.click(visibilityTab);
    expect(getByText('Section Visibility')).toBeInTheDocument();
    expect(getByText(messages.hideFromLearners.defaultMessage)).toBeInTheDocument();
  });

  it('disables the Save button and enables it if there is a change', () => {
    const { getByRole, getByPlaceholderText, getByTestId } = renderComponent();

    const saveButton = getByRole('button', { name: messages.saveButton.defaultMessage });
    expect(saveButton).toBeDisabled();

    const input = getByPlaceholderText('MM/DD/YYYY');
    userEvent.type(input, '12/15/2023');

    const visibilityTab = getByRole('tab', { name: messages.visibilityTabTitle.defaultMessage });
    userEvent.click(visibilityTab);
    const checkbox = getByTestId('visibility-checkbox');
    userEvent.click(checkbox);
    expect(saveButton).not.toBeDisabled();
  });
});

const renderSubsectionComponent = () => render(
  <AppProvider store={store}>
    <IntlProvider locale="en">
      <ConfigureModal
        isOpen
        onClose={onCloseMock}
        onConfigureSubmit={onConfigureSubmitMock}
        currentItemData={currentSubsectionMock}
      />
    </IntlProvider>,
  </AppProvider>,
);

describe('<ConfigureModal /> for Subsection', () => {
  beforeEach(() => {
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
  });

  it('renders subsection ConfigureModal component correctly', () => {
    const { getByText, getByRole } = renderSubsectionComponent();
    expect(getByText(`${currentSubsectionMock.displayName} Settings`)).toBeInTheDocument();
    expect(getByText(messages.basicTabTitle.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.visibilityTabTitle.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.advancedTabTitle.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.releaseDate.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.releaseTimeUTC.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.grading.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.gradeAs.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.dueDate.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.dueTimeUTC.defaultMessage)).toBeInTheDocument();
    expect(getByRole('button', { name: messages.cancelButton.defaultMessage })).toBeInTheDocument();
    expect(getByRole('button', { name: messages.saveButton.defaultMessage })).toBeInTheDocument();
  });

  it('switches to the subsection Visibility tab and renders correctly', () => {
    const { getByRole, getByText } = renderSubsectionComponent();

    const visibilityTab = getByRole('tab', { name: messages.visibilityTabTitle.defaultMessage });
    userEvent.click(visibilityTab);
    expect(getByText('Subsection Visibility')).toBeInTheDocument();
    expect(getByText(messages.showEntireSubsection.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.showEntireSubsectionDescription.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.hideContentAfterDue.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.hideContentAfterDueDescription.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.hideEntireSubsection.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.hideEntireSubsectionDescription.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.assessmentResultsVisibility.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.alwaysShowAssessmentResults.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.alwaysShowAssessmentResultsDescription.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.neverShowAssessmentResults.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.neverShowAssessmentResultsDescription.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.showAssessmentResultsPastDue.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.showAssessmentResultsPastDueDescription.defaultMessage)).toBeInTheDocument();
  });

  it('switches to the subsection Advanced tab and renders correctly', () => {
    const { getByRole, getByText } = renderSubsectionComponent();

    const advancedTab = getByRole('tab', { name: messages.advancedTabTitle.defaultMessage });
    userEvent.click(advancedTab);
    expect(getByText(messages.setSpecialExam.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.none.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.timed.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.timedDescription.defaultMessage)).toBeInTheDocument();
  });

  it('disables the Save button and enables it if there is a change', () => {
    const { getByRole, getByTestId } = renderSubsectionComponent();

    const saveButton = getByRole('button', { name: messages.saveButton.defaultMessage });
    expect(saveButton).toBeDisabled();

    const input = getByTestId('grader-type-select');
    userEvent.selectOptions(input, 'Exam');
    expect(saveButton).not.toBeDisabled();
  });
});

const renderUnitComponent = (props) => render(
  <AppProvider store={store}>
    <IntlProvider locale="en">
      <ConfigureModal
        isOpen
        onClose={onCloseMock}
        onConfigureSubmit={onConfigureSubmitMock}
        currentItemData={currentUnitMock}
        {...props}
      />
    </IntlProvider>,
  </AppProvider>,
);

describe('<ConfigureModal /> for Unit', () => {
  beforeEach(() => {
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
  });

  it('renders unit ConfigureModal component correctly', () => {
    const {
      getByText, queryByText, getByRole, getByTestId,
    } = renderUnitComponent();
    expect(getByText(`${currentUnitMock.displayName} Settings`)).toBeInTheDocument();
    expect(getByText(messages.unitVisibility.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.hideFromLearners.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.restrictAccessTo.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.unitSelectGroupType.defaultMessage)).toBeInTheDocument();

    expect(queryByText(messages.unitSelectGroup.defaultMessage)).not.toBeInTheDocument();
    const input = getByTestId('group-type-select');

    ['0', '1'].forEach(groupeTypeIndex => {
      userEvent.selectOptions(input, groupeTypeIndex);

      expect(getByText(messages.unitSelectGroup.defaultMessage)).toBeInTheDocument();
      currentUnitMock
        .userPartitionInfo
        .selectablePartitions[groupeTypeIndex].groups
        .forEach(g => expect(getByText(g.name)).toBeInTheDocument());
    });

    expect(getByRole('button', { name: messages.cancelButton.defaultMessage })).toBeInTheDocument();
    expect(getByRole('button', { name: messages.saveButton.defaultMessage })).toBeInTheDocument();
  });

  it('disables the Save button and enables it if there is a change', () => {
    const newCurrentItemData = {
      ...currentUnitMock,
      userPartitionInfo: {
        ...currentUnitMock.userPartitionInfo,
        selectedPartitionIndex: 0,
      },
    };
    const { getByRole, getByTestId } = renderUnitComponent({
      currentItemData: newCurrentItemData,
    });

    const saveButton = getByRole('button', { name: messages.saveButton.defaultMessage });
    expect(saveButton).toBeDisabled();

    const input = getByTestId('group-type-select');
    // unrestrict access
    userEvent.selectOptions(input, '-1');
    expect(saveButton).not.toBeDisabled();

    userEvent.selectOptions(input, '0');
    expect(saveButton).toBeDisabled();

    const checkbox = getByTestId('unit-visibility-checkbox');
    userEvent.click(checkbox);
    expect(saveButton).not.toBeDisabled();
  });
});

const renderXBlockComponent = (props) => render(
  <AppProvider store={store}>
    <IntlProvider locale="en">
      <ConfigureModal
        isOpen
        isXBlockComponent
        onClose={onCloseMock}
        onConfigureSubmit={onConfigureSubmitMock}
        currentItemData={currentXBlockMock}
        {...props}
      />
    </IntlProvider>,
  </AppProvider>,
);

describe('<ConfigureModal /> for XBlock', () => {
  beforeEach(() => {
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
  });

  it('renders unit ConfigureModal component correctly', () => {
    const {
      getByText, queryByText, getByRole, getByTestId,
    } = renderXBlockComponent();
    expect(getByText(`Editing access for: ${currentUnitMock.displayName}`)).toBeInTheDocument();
    expect(queryByText(messages.unitVisibility.defaultMessage)).not.toBeInTheDocument();
    expect(queryByText(messages.hideFromLearners.defaultMessage)).not.toBeInTheDocument();
    expect(getByText(messages.restrictAccessTo.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.unitSelectGroupType.defaultMessage)).toBeInTheDocument();

    expect(queryByText(messages.unitSelectGroup.defaultMessage)).not.toBeInTheDocument();
    const input = getByTestId('group-type-select');

    [0, 1].forEach(groupeTypeIndex => {
      userEvent.selectOptions(input, groupeTypeIndex);

      expect(getByText(messages.unitSelectGroup.defaultMessage)).toBeInTheDocument();
      currentUnitMock
        .userPartitionInfo
        .selectablePartitions[groupeTypeIndex].groups
        .forEach(g => expect(getByText(g.name)).toBeInTheDocument());
    });

    expect(getByRole('button', { name: messages.cancelButton.defaultMessage })).toBeInTheDocument();
    expect(getByRole('button', { name: messages.saveButton.defaultMessage })).toBeInTheDocument();
  });

  it('disables the Save button and enables it if there is a change', () => {
    const newCurrentItemData = {
      ...currentUnitMock,
      userPartitionInfo: {
        ...currentUnitMock.userPartitionInfo,
        selectedPartitionIndex: 0,
      },
    };
    const { getByRole, getByTestId } = renderXBlockComponent({
      currentItemData: newCurrentItemData,
    });

    const saveButton = getByRole('button', { name: messages.saveButton.defaultMessage });
    expect(saveButton).toBeDisabled();

    const input = getByTestId('group-type-select');
    // unrestrict access
    userEvent.selectOptions(input,  -1);
    expect(saveButton).not.toBeDisabled();

    userEvent.selectOptions(input,  0);
    expect(saveButton).toBeDisabled();

    const checkbox = getByTestId('unit-visibility-checkbox');
    userEvent.click(checkbox);
    expect(saveButton).not.toBeDisabled();
  });
});

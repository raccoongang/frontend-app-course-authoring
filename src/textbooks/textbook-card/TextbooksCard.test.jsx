import React from 'react';
import { AppProvider } from '@edx/frontend-platform/react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockAdapter from 'axios-mock-adapter';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { initializeMockApp } from '@edx/frontend-platform';

import messages from '../textbook-form/messages';
import { getEditTextbooksApiUrl } from '../data/api';
import { editTextbookQuery } from '../data/thunk';
import { textbooksMock } from '../__mocks__';
import initializeStore from '../../store';
import { executeThunk } from '../../utils';
import TextbookCard from './TextbooksCard';

// eslint-disable-next-line no-unused-vars
let axiosMock;
let store;

const courseId = 'course-v1:org+101+101';
const textbook = textbooksMock.textbooks[1];
const onSubmitMock = jest.fn();
const handleSavingStatusDispatchMock = jest.fn();

const renderComponent = () => render(
  <AppProvider store={store}>
    <IntlProvider locale="en">
      <TextbookCard
        textbook={textbook}
        courseId={courseId}
        onSubmit={onSubmitMock}
        handleSavingStatusDispatch={handleSavingStatusDispatchMock}
      />
    </IntlProvider>
  </AppProvider>,
);

describe('<TextbookCard />', () => {
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
  });

  it('render TextbookCard component correctly', () => {
    const { getByText, getByTestId } = renderComponent();

    expect(getByText(textbook.tabTitle)).toBeInTheDocument();
    expect(getByTestId('textbook-view-button')).toBeInTheDocument();
    expect(getByTestId('textbook-edit-button')).toBeInTheDocument();
    expect(getByTestId('textbook-delete-button')).toBeInTheDocument();
    expect(getByText('1 PDF chapters')).toBeInTheDocument();

    const collapseButton = document.querySelector('.collapsible-trigger');
    userEvent.click(collapseButton);

    textbook.chapters.forEach(({ title, url }) => {
      expect(getByText(title)).toBeInTheDocument();
      expect(getByText(url)).toBeInTheDocument();
    });
  });

  it('render edit TextbookForm after clicking on edit button', async () => {
    const { getByTestId, queryByTestId } = renderComponent();

    const editButton = getByTestId('textbook-edit-button');
    userEvent.click(editButton);

    await waitFor(() => {
      expect(getByTestId('textbook-form')).toBeInTheDocument();
      expect(queryByTestId('textbook-card')).not.toBeInTheDocument();
    });
  });

  it('close edit TextbookForm after clicking on cancel button', async () => {
    const { getByTestId, queryByTestId } = renderComponent();

    const editButton = getByTestId('textbook-edit-button');
    userEvent.click(editButton);

    await waitFor(() => {
      expect(getByTestId('textbook-form')).toBeInTheDocument();
      expect(queryByTestId('textbook-card')).not.toBeInTheDocument();
    });

    const cancelButton = getByTestId('cancel-button');
    userEvent.click(cancelButton);

    await waitFor(() => {
      expect(queryByTestId('textbook-form')).not.toBeInTheDocument();
      expect(getByTestId('textbook-card')).toBeInTheDocument();
    });
  });

  it('calls onSubmit when the "Save" button is clicked with a valid form', async () => {
    const { getByPlaceholderText, getByRole, getByTestId } = renderComponent();

    const editButton = getByTestId('textbook-edit-button');
    userEvent.click(editButton);

    const tabTitleInput = getByPlaceholderText(messages.tabTitlePlaceholder.defaultMessage);
    const chapterInput = getByPlaceholderText(
      messages.chapterTitlePlaceholder.defaultMessage.replace('{value}', textbooksMock.textbooks[1].chapters.length),
    );
    const urlInput = getByPlaceholderText(messages.chapterUrlPlaceholder.defaultMessage);

    const newFormValues = {
      tab_title: 'Tab title',
      chapters: [
        {
          title: 'Chapter',
          url: 'Url',
        },
      ],
      id: textbooksMock.textbooks[1].id,
    };

    await userEvent.clear(tabTitleInput);
    userEvent.type(tabTitleInput, newFormValues.tab_title);
    await userEvent.clear(chapterInput);
    userEvent.type(chapterInput, newFormValues.chapters[0].title);
    await userEvent.clear(urlInput);
    userEvent.type(urlInput, newFormValues.chapters[0].url);

    userEvent.click(getByRole('button', { name: messages.saveButton.defaultMessage }));

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith(
        newFormValues,
        expect.objectContaining({ submitForm: expect.any(Function) }),
      );
    });

    axiosMock
      .onPost(getEditTextbooksApiUrl(courseId, textbooksMock.textbooks[1].id))
      .reply(200);

    await executeThunk(editTextbookQuery(courseId, newFormValues), store.dispatch);
  });
});

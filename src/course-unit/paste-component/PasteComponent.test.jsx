import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // for expect.extend

import { AppProvider } from '@edx/frontend-platform/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { initializeMockApp } from '@edx/frontend-platform';
import WhatsInClipboard from './components/WhatsInClipboard';
import PasteComponent from '.';
import initializeStore from '../../store';
import messages from './messages';
import { act } from 'react-dom/test-utils';

let store;
const handleCreateNewCourseXBlock = jest.fn();
const clipboardData = {
  content: {
    id: 121,
    userId: 3,
    created: '2024-01-31T11:47:50.552158Z',
    purpose: 'clipboard',
    status: 'ready',
    blockType: 'discussion',
    blockTypeDisplay: 'Discussion',
    olxUrl: 'http://localhost:18010/api/content-staging/v1/staged-content/121/olx',
    displayName: 'Discussion',
  },
  sourceUsageKey: 'block-v1:edx+5555+2024+type@discussion+block@discussion4',
  sourceContextTitle: 'Best course',
  sourceEditUrl: 'http://localhost:18010/container/block-v1:edx+5555+2024+type@vertical+block@1c31b4e045e241ab91ee8c1030203e0d',
};

const RootWrapper = (props) => (
  <AppProvider store={store}>
    <IntlProvider locale="en">
      <PasteComponent handleCreateNewCourseXBlock={handleCreateNewCourseXBlock} clipboardData={clipboardData} />
    </IntlProvider>
  </AppProvider>
);

describe('PasteComponent', () => {
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
  });

  it('renders without crashing', () => {
    const { getByRole } = render(<RootWrapper />);
    const pasteComponentBtn = getByRole('button', { name: messages.pasteComponentButtonText.defaultMessage })

    expect(pasteComponentBtn).toBeInTheDocument();
    expect(document.querySelector('[data-testid="whats-in-clipboard"]')).toBeInTheDocument();
  });

  it('calls handleCreateNewCourseXBlock when PasteComponentButton is clicked', () => {
    const { getByRole } = render(<RootWrapper />);
    const pasteComponentBtn = getByRole('button', { name: messages.pasteComponentButtonText.defaultMessage })

    fireEvent.click(pasteComponentBtn);

    expect(handleCreateNewCourseXBlock).toHaveBeenCalledTimes(1);
  });

  // it('toggles popover when WhatsInClipboard is hovered or focused', () => {
  //   const { getByRole, getByTestId } = render(<RootWrapper />);
  //   const whatsInClipboard = getByTestId('whats-in-clipboard');
  //   fireEvent.mouseEnter(whatsInClipboard);
  //   const popoverContainer = getByTestId('popover-container');
  //
  //   act(() => {
  //     fireEvent.mouseEnter(popoverContainer);
  //   });
  //   expect(popoverContainer).toHaveAttribute('aria-expanded', 'true');
  //
  //   act(() => {
  //     fireEvent.mouseLeave(popoverContainer);
  //   });
  //   expect(popoverContainer).toHaveAttribute('aria-expanded', 'false');
  // });

  // Add more tests based on your component behavior and structure
});

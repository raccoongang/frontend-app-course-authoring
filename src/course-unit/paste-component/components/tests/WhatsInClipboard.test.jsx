import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // for expect.extend

import { AppProvider } from '@edx/frontend-platform/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import WhatsInClipboard from '../WhatsInClipboard';
import CourseUnit from '../../../CourseUnit';
import { initializeMockApp } from '@edx/frontend-platform';
import initializeStore from '../../../../store';
import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import {
  getCourseSectionVerticalApiUrl,
  getCourseUnitApiUrl,
  getCourseVerticalChildrenApiUrl
} from '../../../data/api';
import { courseSectionVerticalMock, courseUnitIndexMock, courseVerticalChildrenMock } from '../../../__mocks__';
import { executeThunk } from '../../../../utils';
import {
  fetchCourseSectionVerticalData,
  fetchCourseUnitQuery,
  fetchCourseVerticalChildrenData
} from '../../../data/thunk';
import { act } from 'react-dom/test-utils';

let store;
const handlePopoverToggle = jest.fn();
const togglePopover = jest.fn();
const popoverElementRef = { current: document.createElement('div') };

const RootWrapper = (props) => (
  <AppProvider store={store}>
    <IntlProvider locale="en">
      <WhatsInClipboard
        handlePopoverToggle={handlePopoverToggle}
        togglePopover={togglePopover}
        popoverElementRef={popoverElementRef}
      />
    </IntlProvider>
  </AppProvider>
);

describe('WhatsInClipboard', () => {
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
    render(<RootWrapper />);

    // You can add more specific assertions based on your component structure
    expect(document.querySelector('[data-testid="whats-in-clipboard"]')).toBeInTheDocument();
  });

  it('toggles popover on mouse enter and leave', () => {
    const { getByTestId } = render(<RootWrapper />);

    const component = getByTestId('whats-in-clipboard');

    fireEvent.mouseEnter(component);
    expect(handlePopoverToggle).toHaveBeenCalledWith(true);

    fireEvent.mouseLeave(component);
    expect(handlePopoverToggle).toHaveBeenCalledWith(false);
  });

  it('toggles popover on focus and blur', () => {
    const { getByTestId } = render(<RootWrapper />);

    const component = getByTestId('whats-in-clipboard');

    fireEvent.focus(component);
    expect(togglePopover).toHaveBeenCalledWith(true);

    fireEvent.blur(component);
    expect(togglePopover).toHaveBeenCalledWith(false);
  });
});

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
// eslint-disable-next-line import/no-extraneous-dependencies
import thunk from 'redux-thunk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { IntlProvider } from 'react-intl';

import AdvancedSettings from './AdvancedSettings';

// Mock the TextareaAutosize component
jest.mock('react-textarea-autosize', () => jest.fn((props) => (
  <textarea
    {...props}
    onFocus={() => {}}
    onBlur={() => {}}
  />
)));

describe('AdvancedSettings', () => {
  const courseId = 'course-123';

  it('renders the component and handles setting change', () => {
    const mockStore = configureStore([thunk]);
    const initialState = {
      advancedSettings: {
        courseAppSettings: {
          settingName: {
            deprecated: false,
            help: 'This is a help message',
            displayName: 'Setting Name',
            value: 'Setting Value',
          },
        },
        savingStatus: 'idle',
      },
    };
    const store = mockStore(initialState);

    const { getByLabelText } = render(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AdvancedSettings intl={{}} courseId={courseId} />
        </IntlProvider>
      </Provider>,
    );

    const input = getByLabelText('Setting Name');
    fireEvent.change(input, { target: { value: 'New Value' } });

    expect(input.value).toBe('New Value');
  });

  it('dispatches update action when saving settings', () => {
    const mockStore = configureStore([thunk]);
    const initialState = {
      advancedSettings: {
        courseAppSettings: {
          settingName: {
            deprecated: false,
            help: 'This is a help message',
            displayName: 'Setting Name',
            value: 'Setting Value',
          },
        },
        savingStatus: 'idle',
      },
    };
    const store = mockStore(initialState);

    const { getByText, getByLabelText } = render(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AdvancedSettings intl={{}} courseId={courseId} />
        </IntlProvider>
      </Provider>,
    );

    const input = getByLabelText('Setting Name');
    fireEvent.change(input, { target: { value: 'New Value' } });

    const saveButton = getByText('Save Changes');
    fireEvent.click(saveButton);

    const actions = store.getActions();
    expect(actions).toHaveLength(2);
    expect(actions[0]).toEqual({
      type: 'advancedSettings/updateLoadingStatus',
      payload: {
        status: 'in-progress',
      },
    });
  });

  it('dispatches reset action when canceling settings', () => {
    const mockStore = configureStore([thunk]);
    const initialState = {
      advancedSettings: {
        courseAppSettings: {
          settingName: {
            deprecated: false,
            help: 'This is a help message',
            displayName: 'Setting Name',
            value: 'Setting Value',
          },
        },
        savingStatus: 'idle',
      },
    };
    const store = mockStore(initialState);

    const { getByText, getByLabelText } = render(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AdvancedSettings intl={{}} courseId={courseId} />
        </IntlProvider>
      </Provider>,
    );

    const input = getByLabelText('Setting Name');
    fireEvent.change(input, { target: { value: 'New Value' } });

    const cancelButton = getByText('Cancel');
    fireEvent.click(cancelButton);

    const actions = store.getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0]).toEqual({
      type: 'advancedSettings/updateLoadingStatus',
      payload: {
        status: 'in-progress',
      },
    });
  });
});

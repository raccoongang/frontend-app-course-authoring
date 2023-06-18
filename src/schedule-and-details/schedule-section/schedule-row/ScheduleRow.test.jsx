import React from 'react';
import { render, fireEvent } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { IntlProvider } from 'react-intl';
import renderer from 'react-test-renderer';

import { courseDetails } from '../../__mocks__';
import { ScheduleRow } from '.';

describe('<ScheduleRow />', () => {
  const onChangeMock = jest.fn();
  const RootWrapper = (props) => (
    <IntlProvider locale="en">
      <ScheduleRow {...props} />
    </IntlProvider>
  );

  const props = {
    value: courseDetails.startDate,
    labels: ['fooLabelDate', 'fooLabelTime'],
    helpText: 'barHelpText',
    readonly: false,
    controlName: 'startDate',
    errorFeedback: 'foo bar error',
    onChange: onChangeMock,
  };

  it('matches the snapshots', () => {
    const tree = renderer.create(<RootWrapper {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders without crashing', () => {
    const { getByText, queryAllByText } = render(<RootWrapper {...props} />);
    expect(getByText(props.labels[0])).toBeInTheDocument();
    expect(getByText(props.labels[1])).toBeInTheDocument();
    expect(getByText(props.helpText)).toBeInTheDocument();
    expect(getByText(props.errorFeedback)).toBeInTheDocument();
    expect(queryAllByText(/(UTC)/i).length).toBe(1);
  });

  it('calls onChange on datepicker input change', () => {
    const { getByPlaceholderText } = render(<RootWrapper {...props} />);
    const input = getByPlaceholderText('MM/DD/YYYY');
    fireEvent.change(input, { target: { value: '06/15/2023' } });
    expect(onChangeMock).toHaveBeenCalledWith(
      '2023-06-15T00:00:00Z',
      props.controlName,
    );
  });
});

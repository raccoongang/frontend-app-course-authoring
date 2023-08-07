import React from 'react';
import { render } from '@testing-library/react';

import ProcessingNotification from '.';

const props = {
  title: 'Saving',
  isShow: true,
};

describe('<ProcessingNotification />', () => {
  it('renders successfully', () => {
    const { getByText } = render(<ProcessingNotification {...props} />);
    expect(getByText(props.title)).toBeInTheDocument();
  });
});

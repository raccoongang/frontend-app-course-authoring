import { render } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import ModalContainer from './ModalContainer';

const mockProps = {
  title: 'Data Analytics Boot Camp',
  isOpen: true,
  close: false,
  children: <>Course Description</>,
  btnText: 'Save',
  size: 'sm',
};

const renderComponent = (props) => render(
  <IntlProvider locale="en">
    <ModalContainer {...props} />
  </IntlProvider>,
);

describe('<ModalContainer />', () => {
  it('render ModalContainer component correctly', () => {
    const { getByText } = renderComponent(mockProps);

    expect(getByText(mockProps.title)).toBeInTheDocument();
    expect(getByText(mockProps.btnText)).toBeInTheDocument();
    expect(getByText('Course Description')).toBeInTheDocument();
  });
});

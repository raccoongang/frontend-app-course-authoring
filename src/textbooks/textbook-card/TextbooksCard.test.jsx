import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import userEvent from '@testing-library/user-event';
import TextbookCard from './TextbooksCard';
import { textbooksMock } from '../__mocks__';

const textbook = textbooksMock.textbooks[0];

const renderComponent = () => render(
  <IntlProvider locale="en">
    <TextbookCard
      title={textbook.tabTitle}
      chapters={textbook.chapters}
    />
  </IntlProvider>,
);

describe('<TextbookCard />', () => {
  it('render TextbookCard component correctly', () => {
    const { getByText, getByTestId } = renderComponent();

    expect(getByText(textbook.tabTitle)).toBeInTheDocument();
    expect(getByTestId('textbook-view-button')).toBeInTheDocument();
    expect(getByTestId('textbook-edit-button')).toBeInTheDocument();
    expect(getByTestId('textbook-delete-button')).toBeInTheDocument();
    expect(getByText('2 PDF chapters')).toBeInTheDocument();

    const collapseButton = document.querySelector('.collapsible-trigger');
    userEvent.click(collapseButton);

    textbook.chapters.forEach(({ title, url }) => {
      expect(getByText(title)).toBeInTheDocument();
      expect(getByText(url)).toBeInTheDocument();
    });
  });
});

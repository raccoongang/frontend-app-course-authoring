import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import OutlineSection from './OutlineSection';
import { STAFF_ONLY } from '../constants';
import messages from './messages';

const section = {
  displayName: 'Section Name',
  published: true,
  releasedToStudents: true,
  visibleToStaffOnly: false,
  visibilityState: 'visible',
  staffOnlyMessage: false,
};

const renderComponent = (props) => render(
  <IntlProvider locale="en">
    <OutlineSection section={section} {...props} />
  </IntlProvider>,
);

describe('<OutlineSection />', () => {
  it('render OutlineSection component correctly', () => {
    const { getByText, getByTestId } = renderComponent();

    expect(getByText(section.displayName)).toBeInTheDocument();
    expect(getByTestId('header-expanded-btn')).toBeInTheDocument();
    expect(getByTestId('header-badge-status')).toBeInTheDocument();
    expect(getByTestId('header-menu')).toBeInTheDocument();
    expect(getByTestId('outline-section__content')).toBeInTheDocument();
  });

  it('render status badge as live', () => {
    const { getByText } = renderComponent();
    expect(getByText(messages.statusBadgeLive.defaultMessage)).toBeInTheDocument();
  });

  it('render status badge as published_not_live', () => {
    const { getByText } = renderComponent({
      section: {
        ...section,
        releasedToStudents: false,
      },
    });

    expect(getByText(messages.statusBadgePublishedNotLive.defaultMessage)).toBeInTheDocument();
  });

  it('render status badge as staff_only', () => {
    const { getByText } = renderComponent({
      section: {
        ...section,
        published: false,
        releasedToStudents: false,
        visibleToStaffOnly: true,
        staffOnlyMessage: true,
        visibilityState: STAFF_ONLY,
      },
    });

    expect(getByText(messages.statusBadgeStuffOnly.defaultMessage)).toBeInTheDocument();
  });

  it('render status badge as draft', () => {
    const { getByText } = renderComponent({
      section: {
        ...section,
        published: false,
      },
    });

    expect(getByText(messages.statusBadgeDraft.defaultMessage)).toBeInTheDocument();
  });

  it('expands/collapses the section when the expand button is clicked', () => {
    const { queryByTestId, getByTestId } = renderComponent();

    const expandButton = getByTestId('header-expanded-btn');
    fireEvent.click(expandButton);
    expect(queryByTestId('outline-section__content')).not.toBeInTheDocument();

    fireEvent.click(expandButton);
    expect(queryByTestId('outline-section__content')).toBeInTheDocument();
  });
});

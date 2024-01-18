import React from 'react';
import { render, screen } from '@testing-library/react';

import SidebarBlock from '.';

describe('SidebarBlock', () => {
  test('renders without crashing', () => {
    render(<SidebarBlock title="Test Title" paragraphs={['Test Paragraph']} isLast={false} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Paragraph')).toBeInTheDocument();
  });

  test('renders <hr> if isLast is false', () => {
    render(<SidebarBlock title="Test Title" paragraphs={['Test Paragraph']} isLast={false} />);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  test('does not render <hr> if isLast is true', () => {
    render(<SidebarBlock title="Test Title" paragraphs={['Test Paragraph']} isLast />);
    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
  });
});

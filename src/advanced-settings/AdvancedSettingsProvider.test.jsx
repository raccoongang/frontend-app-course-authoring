import React from 'react';
import { render } from '@testing-library/react';
import { AdvancedSettingsContext } from './AdvancedSettingsProvider';

describe('AdvancedSettingsProvider', () => {
  it('renders the provider with the correct context value', () => {
    const courseId = '123';
    const path = `/course/${courseId}/settings/advanced`;

    const { getByText } = render(
      <AdvancedSettingsContext.Provider value={{ courseId, path }}>
        <ChildComponent />
      </AdvancedSettingsContext.Provider>,
    );

    // Assert that the child component receives the correct context value
    expect(getByText(`Course ID: ${courseId}`)).toBeInTheDocument();
    expect(getByText(`Path: ${path}`)).toBeInTheDocument();
  });
});

// ChildComponent is a dummy component to test the context value
const ChildComponent = () => {
  const { courseId, path } = React.useContext(AdvancedSettingsContext);

  return (
    <div>
      <p>Course ID: {courseId}</p>
      <p>Path: {path}</p>
    </div>
  );
};

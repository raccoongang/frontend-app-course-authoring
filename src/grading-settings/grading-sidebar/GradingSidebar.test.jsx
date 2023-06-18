import React from 'react';
import renderer from 'react-test-renderer';
import { IntlProvider, injectIntl } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';

import GradingSidebar from '.';

const mockPathname = '/foo-bar';
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: mockPathname,
  }),
}));

describe('<GradingSidebar />', () => {
  const config = { STUDIO_BASE_URL: 'https://example.com' };
  const courseId = 'course123';
  it('should match the snapshot', () => {
    const tree = renderer
      .create(
        <AppContext.Provider value={{ config }}>
          <IntlProvider locale="en">
            <GradingSidebar
              intl={injectIntl}
              courseId={courseId}
              proctoredExamSettingsUrl="link://to"
            />
          </IntlProvider>
        </AppContext.Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

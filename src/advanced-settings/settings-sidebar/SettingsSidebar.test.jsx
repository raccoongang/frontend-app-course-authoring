import React from 'react';
import renderer from 'react-test-renderer';
// eslint-disable-next-line import/no-extraneous-dependencies
import { IntlProvider, intl } from 'react-intl';
import { AppContext } from '@edx/frontend-platform/react';
import SettingsSidebar from './SettingsSidebar';

describe('SettingsSidebar', () => {
  const config = {
    STUDIO_BASE_URL: 'https://example.com',
  };

  const courseId = 'course123';

  it('should match the snapshot', () => {
    const tree = renderer.create(
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      <AppContext.Provider value={{ config }}>
        <IntlProvider locale="en">
          <SettingsSidebar intl={intl} courseId={courseId} />
        </IntlProvider>
      </AppContext.Provider>,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});

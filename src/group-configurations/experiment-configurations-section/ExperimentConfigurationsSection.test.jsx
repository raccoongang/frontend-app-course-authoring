import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import { experimentGroupConfigurationsMock } from '../__mocks__';
import messages from './messages';
import ExperimentConfigurationsSection from '.';

const renderComponent = (props) => render(
  <IntlProvider locale="en">
    <ExperimentConfigurationsSection
      availableGroups={experimentGroupConfigurationsMock}
      {...props}
    />
  </IntlProvider>,
);

describe('<ExperimentConfigurationsSection />', () => {
  it('renders component correctly', () => {
    const { getByText, getByRole, getAllByTestId } = renderComponent();
    expect(getByText(messages.title.defaultMessage)).toBeInTheDocument();
    expect(
      getByRole('button', { name: messages.addNew.defaultMessage }),
    ).toBeInTheDocument();
    expect(getAllByTestId('configuration-card')).toHaveLength(
      experimentGroupConfigurationsMock.length,
    );
  });

  it('renders empty section', () => {
    const { getByTestId } = renderComponent({ availableGroups: [] });
    expect(
      getByTestId('group-configurations-empty-placeholder'),
    ).toBeInTheDocument();
  });
});

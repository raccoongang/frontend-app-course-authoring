import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Card } from '@edx/paragon';

import MainLayout from '../layout/MainLayout';
import messages from '../messages';

const WithoutModes = ({ courseId }) => {
  const intl = useIntl();
  return (
    <MainLayout showHeaderButtons={false} courseId={courseId}>
      <Card>
        <Card.Section className="d-flex justify-content-center">
          <span className="small">{intl.formatMessage(messages.withoutModesText)}</span>
        </Card.Section>
      </Card>
    </MainLayout>
  );
};

WithoutModes.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default WithoutModes;

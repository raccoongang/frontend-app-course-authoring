import PropTypes from 'prop-types';
import {
  Container, Button, Layout, Dropdown, DropdownButton,
} from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import SubHeader from '../../generic/sub-header/SubHeader';
import CertificatesSidebar from '../certificates-sidebar/CertificatesSidebar';
import messages from '../messages';

const MainLayout = ({ courseId, showHeaderButtons, children }) => {
  const intl = useIntl();
  return (
    <Container size="xl" className="certificates px-4">
      <div className="mt-5" />
      <SubHeader
        hideBorder
        subtitle={intl.formatMessage(messages.headingSubtitle)}
        title={intl.formatMessage(messages.headingTitle)}
        headerActions={showHeaderButtons && ( // TODO create btn handlers in the task (https://youtrack.raccoongang.com/issue/AXIMST-166)
          <>
            <DropdownButton id="dropdown-basic-button">
              <Dropdown.Item />
            </DropdownButton>
            <Button variant="outline-primary">
              {intl.formatMessage(messages.headingActionsPreview)}
            </Button>
            <Button variant="outline-primary">
              {intl.formatMessage(messages.headingActionsDeactivate)}
            </Button>
          </>
        )}
      />
      <section>
        <Layout
          lg={[{ span: 9 }, { span: 3 }]}
          md={[{ span: 9 }, { span: 3 }]}
          sm={[{ span: 9 }, { span: 3 }]}
          xs={[{ span: 9 }, { span: 3 }]}
          xl={[{ span: 9 }, { span: 3 }]}
        >
          <Layout.Element>
            {children}
          </Layout.Element>
          <Layout.Element>
            <CertificatesSidebar courseId={courseId} />
          </Layout.Element>
        </Layout>
      </section>
    </Container>
  );
};

MainLayout.defaultProps = {
  showHeaderButtons: true,
  children: null,
};

MainLayout.propTypes = {
  courseId: PropTypes.string.isRequired,
  showHeaderButtons: PropTypes.bool,
  children: PropTypes.node,
};

export default MainLayout;

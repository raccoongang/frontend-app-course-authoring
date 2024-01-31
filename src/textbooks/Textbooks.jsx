import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Breadcrumb,
  Button,
  Container,
  Layout,
  Row,
} from '@edx/paragon';
import { Add as AddIcon } from '@edx/paragon/icons';

import { useModel } from '../generic/model-store';
import { LoadingSpinner } from '../generic/Loading';
import SubHeader from '../generic/sub-header/SubHeader';
import getPageHeadTitle from '../generic/utils';
import EmptyPlaceholder from './empty-placeholder/EmptyPlaceholder';
import TextbookCard from './textbook-card/TextbooksCard';
import TextbookSidebar from './textbook-sidebar/TextbookSidebar';
import { useTextbooks } from './hooks';
import messages from './messages';

const Textbooks = ({ courseId }) => {
  const intl = useIntl();

  const courseDetails = useModel('courseDetails', courseId);
  document.title = getPageHeadTitle(courseDetails?.name, intl.formatMessage(messages.headingTitle));

  const { textbooks, isLoading, breadcrumbs } = useTextbooks(courseId);

  if (isLoading) {
    return (
      <Row className="m-0 mt-4 justify-content-center">
        <LoadingSpinner />
      </Row>
    );
  }

  return (
    <Container size="xl" className="px-4">
      <section className="mb-4 mt-5">
        <SubHeader
          title={intl.formatMessage(messages.headingTitle)}
          breadcrumbs={<Breadcrumb ariaLabel={intl.formatMessage(messages.breadcrumbAriaLabel)} links={breadcrumbs} />}
          headerActions={(
            <Button
              iconBefore={AddIcon}
              // TODO: add handler for opening textbooks form
              onClick={() => null}
            >
              {intl.formatMessage(messages.newTextbookButton)}
            </Button>
          )}
        />
        <Layout
          lg={[{ span: 9 }, { span: 3 }]}
          md={[{ span: 9 }, { span: 3 }]}
          sm={[{ span: 12 }, { span: 12 }]}
          xs={[{ span: 12 }, { span: 12 }]}
          xl={[{ span: 9 }, { span: 3 }]}
        >
          <Layout.Element>
            <article>
              <section className="textbook-section">
                <div className="pt-4">
                  {textbooks.length ? textbooks.map(({ tabTitle, chapters, id }) => (
                    <TextbookCard
                      key={id}
                      chapters={chapters}
                      title={tabTitle}
                    />
                  )) : (
                    // TODO: add handler for opening textbooks form
                    <EmptyPlaceholder onCreateNewTextbook={() => null} />
                  )}
                </div>
              </section>
            </article>
          </Layout.Element>
          <Layout.Element>
            <TextbookSidebar
              courseId={courseId}
            />
          </Layout.Element>
        </Layout>
      </section>
    </Container>
  );
};

Textbooks.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default Textbooks;

import React from 'react';
import {
  Button, Container, Layout,
} from '@edx/paragon';
import { Add as AddIcon } from '@edx/paragon/icons/es5';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import InternetConnectionAlert from '../generic/internet-connection-alert';
import { RequestStatus } from '../data/constants';
import Loading from '../generic/Loading';
import Header from '../studio-header/Header';
import {
  updateSavingStatus,
} from '../generic/data/slice';
import { updateCreateOrRerunCourseQuery } from '../generic/data/thunks';
import SubHeader from '../generic/sub-header/SubHeader';
import SettingsSidebar from './settings-sidebar/SettingsSidebar';
import TabsSection from './tabs-section';
import OrganizationSection from './organization-section';
import CreateNewCourseForm from './create-new-course-form';
import messages from './messages';
import { useStudioHome } from './hooks';

const StudioHome = ({ intl }) => {
  const {
    isLoading,
    savingStatus,
    newCourseData,
    studioHomeItems,
    showNewCourseContainer,
    showOrganizationDropdown,
    dispatch,
    setShowNewCourseContainer,
  } = useStudioHome();

  if (isLoading) {
    return <Loading />;
  }

  const handleCreateNewCourse = () => {
    dispatch(updateSavingStatus({ status: RequestStatus.PENDING }));
  };

  const handleQueryProcessing = () => {
    dispatch(updateCreateOrRerunCourseQuery(newCourseData));
  };

  const handleInternetConnectionFailed = () => {
    dispatch(updateSavingStatus({ status: RequestStatus.FAILED }));
  };

  return (
    <>
      <Header hideMainMenu />
      <Container size="xl" className="studio-home">
        <section className="mb-4">
          <article className="studio-home-sub-header">
            <section>
              <SubHeader
                title={intl.formatMessage(messages.headingTitle)}
                headerActions={(
                  <Button
                    variant="outline-primary"
                    iconBefore={AddIcon}
                    size="sm"
                    disabled={showNewCourseContainer}
                    onClick={() => setShowNewCourseContainer(true)}
                  >
                    {intl.formatMessage(messages.addNewCourseBtnText)}
                  </Button>
                )}
              />
            </section>
          </article>
          <Layout
            lg={[{ span: 9 }, { span: 3 }]}
            md={[{ span: 9 }, { span: 3 }]}
            sm={[{ span: 9 }, { span: 3 }]}
            xs={[{ span: 9 }, { span: 3 }]}
            xl={[{ span: 9 }, { span: 3 }]}
          >
            <Layout.Element>
              <section>
                {showNewCourseContainer && (
                  <CreateNewCourseForm
                    handleOnClickCancel={() => setShowNewCourseContainer(false)}
                    handleOnClickCreate={handleCreateNewCourse}
                  />
                )}
                {showOrganizationDropdown && <OrganizationSection />}
                <TabsSection tabsData={studioHomeItems} />
              </section>
            </Layout.Element>
            <Layout.Element>
              <SettingsSidebar />
            </Layout.Element>
          </Layout>
        </section>
      </Container>
      <div className="alert-toast">
        <InternetConnectionAlert
          isFailed={savingStatus === RequestStatus.FAILED}
          isQueryPending={savingStatus === RequestStatus.PENDING}
          onQueryProcessing={handleQueryProcessing}
          onInternetConnectionFailed={handleInternetConnectionFailed}
        />
      </div>
    </>
  );
};

StudioHome.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(StudioHome);

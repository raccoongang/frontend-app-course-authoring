import React, { useEffect, useState } from 'react';
import {
  Button, Container, Layout,
} from '@edx/paragon';
import { history } from '@edx/frontend-platform';
import { Add as AddIcon } from '@edx/paragon/icons/es5';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { useDispatch, useSelector } from 'react-redux';

import InternetConnectionAlert from '../generic/internet-connection-alert';
import { RequestStatus } from '../data/constants';
import Loading from '../generic/Loading';
import Header from '../studio-header/Header';
import SubHeader from '../generic/sub-header/SubHeader';
import SettingsSidebar from './settings-sidebar/SettingsSidebar';
import TabsSection from './tabs-section';
import OrganizationSection from './organization-section';
import CreateNewCourse from './create-new-course';
import { redirectToCourseIndex } from './constants';
import messages from './messages';
import {
  getLoadingStatus,
  getStudioHomeData,
  getSavingStatus,
  getNewCourseData,
} from './data/selectors';
import { fetchStudioHomeData, createNewCourseQuery } from './data/thunks';
import { updateSavingStatus } from './data/slice';

const StudioHome = ({ intl }) => {
  const dispatch = useDispatch();
  const [isQueryPending, setIsQueryPending] = useState(false);
  const studioHomeData = useSelector(getStudioHomeData);
  const loadingStatus = useSelector(getLoadingStatus);
  const savingStatus = useSelector(getSavingStatus);
  const newCourseData = useSelector(getNewCourseData);
  const [studioHomeItems, setStudioHomeItems] = useState(studioHomeData);
  const [showNewCourseContainer, setShowNewCourseContainer] = useState(false);
  const isLoading = loadingStatus === RequestStatus.IN_PROGRESS;

  useEffect(() => {
    dispatch(fetchStudioHomeData());
  }, []);

  useEffect(() => {
    if (studioHomeData) {
      setStudioHomeItems(studioHomeData);
    }
  }, [studioHomeData]);

  useEffect(() => {
    if (savingStatus === RequestStatus.SUCCESSFUL) {
      dispatch(updateSavingStatus({ status: '' }));
      setIsQueryPending(false);
      const { url } = newCourseData;
      if (url) {
        history.push(redirectToCourseIndex(url));
      }
    }
  }, [savingStatus]);

  if (isLoading) {
    return <Loading />;
  }

  const handleCreateNewCourse = () => {
    setIsQueryPending(true);
  };

  const handleQueryProcessing = () => {
    dispatch(createNewCourseQuery(newCourseData));
  };

  const handleInternetConnectionFailed = () => {
    setIsQueryPending(false);
  };

  return (
    <>
      <Header isHomePage />
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
                  <CreateNewCourse
                    handleOnClickCancel={() => setShowNewCourseContainer(false)}
                    handleOnClickCreate={handleCreateNewCourse}
                  />
                )}
                <OrganizationSection />
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
          isQueryPending={isQueryPending}
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

import React, { useEffect, useState } from 'react';
import { Button, Container, Layout } from '@edx/paragon';
import { Add as AddIcon } from '@edx/paragon/icons/es5';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { useDispatch, useSelector } from 'react-redux';

import { RequestStatus } from '../data/constants';
import Loading from '../generic/Loading';
import Header from '../studio-header/Header';
import SubHeader from '../generic/sub-header/SubHeader';
import SettingsSidebar from './settings-sidebar/SettingsSidebar';
import TabsSection from './tabs-section';
import SettingsSection from './settings-section';
import messages from './messages';
import { getLoadingStatus, getStudioHomeData } from './data/selectors';
import { fetchStudioHomeData } from './data/thunks';

const StudioHome = ({ intl }) => {
  const studioHomeData = useSelector(getStudioHomeData);
  const loadingStatus = useSelector(getLoadingStatus);
  const [studioHomeItems, setStudioHomeItems] = useState(studioHomeData);
  const dispatch = useDispatch();
  const isLoading = loadingStatus === RequestStatus.IN_PROGRESS;

  useEffect(() => {
    dispatch(fetchStudioHomeData());
  }, []);

  useEffect(() => {
    if (studioHomeData) {
      setStudioHomeItems(studioHomeData);
    }
  }, [studioHomeData]);

  if (isLoading) {
    return <Loading />;
  }

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
                    disabled
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
                <SettingsSection />
                <TabsSection tabsData={studioHomeItems} />
              </section>
            </Layout.Element>
            <Layout.Element>
              <SettingsSidebar />
            </Layout.Element>
          </Layout>
        </section>
      </Container>
    </>
  );
};

StudioHome.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(StudioHome);

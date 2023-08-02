import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs } from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import messages from '../messages';
import LibrariesTab from './libraries-tab';
import ArchivedTab from './archived-tab';
import CoursesTab from './courses-tab';

const TabsSection = ({ intl, tabsData }) => {
  const {
    activeTab, courses, librariesEnabled, libraries, archivedCourses,
  } = tabsData;

  // Controlling the visibility of tabs when using conditional rendering is necessary for
  // the correct operation of iterating over child elements inside the Paragon Tabs component.
  const visibleTabs = useMemo(() => {
    const tabs = [];
    tabs.push(
      <Tab
        key="courses"
        eventKey="courses"
        title={intl.formatMessage(messages.coursesTabTitle)}
      >
        <CoursesTab coursesDataItems={courses} />
      </Tab>,
    );
    if (librariesEnabled) {
      tabs.push(
        <Tab
          key="libraries"
          eventKey="libraries"
          title={intl.formatMessage(messages.librariesTabTitle)}
        >
          <LibrariesTab libraries={libraries} />
        </Tab>,
      );
    }
    if (archivedCourses.length) {
      tabs.push(
        <Tab
          key="archived"
          eventKey="archived"
          title={intl.formatMessage(messages.archivedTabTitle)}
        >
          <ArchivedTab archivedCoursesData={archivedCourses} />
        </Tab>,
      );
    }

    return tabs;
  }, [archivedCourses, librariesEnabled]);

  return (
    <Tabs
      className="studio-home-tabs"
      variant="tabs"
      defaultActiveKey={activeTab}
    >
      {visibleTabs}
    </Tabs>
  );
};

const courseDataStructure = {
  courseKey: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  lmsLink: PropTypes.string.isRequired,
  number: PropTypes.string.isRequired,
  org: PropTypes.string.isRequired,
  rerunLink: PropTypes.string.isRequired,
  run: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

TabsSection.propTypes = {
  intl: intlShape.isRequired,
  tabsData: PropTypes.shape({
    activeTab: PropTypes.string.isRequired,
    archivedCourses: PropTypes.arrayOf(
      PropTypes.shape(courseDataStructure),
    ).isRequired,
    courses: PropTypes.arrayOf(
      PropTypes.shape(courseDataStructure),
    ).isRequired,
    libraries: PropTypes.arrayOf(
      PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        libraryKey: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        org: PropTypes.string.isRequired,
        number: PropTypes.string.isRequired,
      }),
    ).isRequired,
    librariesEnabled: PropTypes.bool.isRequired,
  }).isRequired,
};

export default injectIntl(TabsSection);

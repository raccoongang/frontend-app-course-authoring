import React from 'react';
import PropTypes from 'prop-types';

import CardItem from '../../card-item';
import DefaultSection from './default-section';

const CoursesTab = ({ coursesDataItems }) => {
  if (!coursesDataItems?.length) {
    return (
      <DefaultSection />
    );
  }

  const sortedCourses = [...coursesDataItems]
    .sort((firstCourseData, secondCourseData) => firstCourseData
      .displayName.localeCompare(secondCourseData.displayName));

  return sortedCourses.map(({
    courseKey, displayName, lmsLink, org, rerunLink, number, run, url,
  }) => (
    <CardItem
      key={courseKey}
      displayName={displayName}
      lmsLink={lmsLink}
      rerunLink={rerunLink}
      org={org}
      number={number}
      run={run}
      url={url}
    />
  ));
};

CoursesTab.propTypes = {
  coursesDataItems: PropTypes.arrayOf(
    PropTypes.shape({
      courseKey: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
      lmsLink: PropTypes.string.isRequired,
      number: PropTypes.string.isRequired,
      org: PropTypes.string.isRequired,
      rerunLink: PropTypes.string.isRequired,
      run: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default CoursesTab;

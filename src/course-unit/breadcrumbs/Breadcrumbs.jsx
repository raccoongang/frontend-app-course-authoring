import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { Dropdown, Icon } from '@edx/paragon';
import {
  ArrowDropDown as ArrowDropDownIcon,
  ChevronRight as ChevronRightIcon,
} from '@edx/paragon/icons';

import { getCourseUnit } from '../data/selectors';
import { useCourseOutline } from '../../course-outline/hooks';

const Breadcrumbs = ({ courseId }) => {
  const { ancestorInfo } = useSelector(getCourseUnit);
  const { sectionsList } = useCourseOutline({ courseId });
  const activeCourseSectionInfo = sectionsList.find((block) => block.id === ancestorInfo?.ancestors[1]?.id);

  const breadcrumbs = {
    section: {
      id: ancestorInfo?.ancestors[1]?.id,
      displayName: ancestorInfo?.ancestors[1]?.displayName,
      dropdownItems: sectionsList || [],
    },
    subsection: {
      id: ancestorInfo?.ancestors[0]?.id,
      displayName: ancestorInfo?.ancestors[0]?.displayName,
      dropdownItems: activeCourseSectionInfo?.childInfo.children || [],
    },
  };

  return (
    <div className="d-flex align-center mb-2.5">
      <Dropdown autoClose="outside">
        <Dropdown.Toggle id="breadcrumbs-dropdown-section" variant="link" className="p-0 text-primary small">
          <span className="small">{breadcrumbs.section.displayName}</span>
          <Icon
            src={ArrowDropDownIcon}
            className="text-primary ml-1"
          />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {breadcrumbs.section.dropdownItems.map(({ studioUrl, displayName }) => (
            <Dropdown.Item
              href={studioUrl}
              className="small"
            >
              {displayName}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <Icon
        src={ChevronRightIcon}
        size="md"
        className="text-primary mx-2"
      />
      <Dropdown autoClose="outside">
        <Dropdown.Toggle id="breadcrumbs-dropdown-subsection" variant="link" className="p-0 text-primary">
          <span className="small">{breadcrumbs.subsection.displayName}</span>
          <Icon
            src={ArrowDropDownIcon}
            className="text-primary ml-1"
          />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {breadcrumbs.subsection.dropdownItems.map(({ studioUrl, displayName }) => (
            <Dropdown.Item
              href={studioUrl}
              className="small"
            >
              {displayName}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

Breadcrumbs.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default Breadcrumbs;

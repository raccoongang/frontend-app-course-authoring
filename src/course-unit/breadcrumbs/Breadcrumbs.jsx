import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Dropdown, Icon } from '@edx/paragon';
import {
  ArrowDropDown as ArrowDropDownIcon,
  ChevronRight as ChevronRightIcon,
} from '@edx/paragon/icons';

import { useCourseOutline } from '../../course-outline/hooks';
import { getCourseUnitData } from '../data/selectors';
import messages from './messages';

const Breadcrumbs = ({ courseId }) => {
  const intl = useIntl();
  const { ancestorInfo } = useSelector(getCourseUnitData);
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
    <nav className="d-flex align-center mb-2.5">
      <ol className="p-0 m-0 d-flex align-center">
        <li className="d-flex">
          <Dropdown>
            <Dropdown.Toggle id="breadcrumbs-dropdown-section" variant="link" className="p-0 text-primary small">
              <span className="small text-gray-700">{breadcrumbs.section.displayName}</span>
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
            alt={intl.formatMessage(messages.altIconChevron)}
          />
        </li>
        <li className="d-flex">
          <Dropdown>
            <Dropdown.Toggle id="breadcrumbs-dropdown-subsection" variant="link" className="p-0 text-primary">
              <span className="small text-gray-700">{breadcrumbs.subsection.displayName}</span>
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
        </li>
      </ol>
    </nav>
  );
};

Breadcrumbs.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default Breadcrumbs;

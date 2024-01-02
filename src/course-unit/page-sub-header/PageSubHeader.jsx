import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button, Dropdown, Form, Icon, IconButton,
} from '@edx/paragon';
import {
  ArrowDropDown as ArrowDropDownIcon,
  ChevronRight as ChevronRightIcon,
  EditOutline as EditIcon,
  Settings as SettingsIcon
} from '@edx/paragon/icons';

import SubHeader from '../../generic/sub-header/SubHeader';
import { useCourseOutline } from '../../course-outline/hooks';

import messages from './messages';

const PageSubHeader = ({
  courseId,
  unitTitle,
  isTitleFormOpen,
  handleTitleEdit,
  handleTitleEditSubmit,
  headerNavigationsActions,
  breadcrumbsData
}) => {
  const intl = useIntl();
  const [titleValue, setTitleValue] = useState(unitTitle);
  const { handleViewLive, handlePreview } = headerNavigationsActions;

  const { sectionsList } = useCourseOutline({ intl, courseId });

  useEffect(() => {
    setTitleValue(unitTitle);
  }, [unitTitle]);

  useEffect(() => {

  }, []);

  // console.log('sectionsList', sectionsList)

  // console.log('breadcrumbsData', breadcrumbsData)

  return (
    <SubHeader
      title={(
        <div className="d-flex align-items-center lead">
          {isTitleFormOpen ? (
            <Form.Group className="m-0">
              <Form.Control
                ref={(e) => e && e.focus()}
                value={titleValue}
                name="displayName"
                onChange={(e) => setTitleValue(e.target.value)}
                aria-label="edit field"
                onBlur={() => handleTitleEditSubmit(titleValue)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleTitleEditSubmit(titleValue);
                  }
                }}
              />
            </Form.Group>
          ) : unitTitle}
          <IconButton
            alt={intl.formatMessage(messages.altButtonEdit)}
            className="ml-1 flex-shrink-0"
            iconAs={EditIcon}
            onClick={handleTitleEdit}
          />
          <IconButton
            alt={intl.formatMessage(messages.altButtonSettings)}
            className="flex-shrink-0"
            iconAs={SettingsIcon}
            onClick={() => {}}
          />
        </div>
      )}
      subtitle={(
        <div className="d-flex align-center mb-2.5">
          <Dropdown autoClose="outside">
            <Dropdown.Toggle variant="link" className="p-0 text-primary small">
              <span className="small">Introduction</span>
              <Icon
                src={ArrowDropDownIcon}
                className="text-primary ml-1"
              />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {sectionsList.map((section) => (
                <Dropdown.Item
                  href={section.studioUrl}
                  className="small"
                >
                  {section.displayName}
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
            <Dropdown.Toggle variant="link" className="p-0 text-primary">
              <span className="small">Getting started</span>
              <Icon
                src={ArrowDropDownIcon}
                className="text-primary ml-1"
              />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item className="small">SubSection item 1</Dropdown.Item>
              <Dropdown.Item className="small">SubSection item 2</Dropdown.Item>
              <Dropdown.Item className="small">SubSection item 3</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )}
      headerActions={(
        <nav className="header-navigations ml-auto flex-shrink-0">
          <Button
            variant="outline-primary"
            onClick={handleViewLive}
          >
            {intl.formatMessage(messages.viewLiveButton)}
          </Button>
          <Button
            variant="outline-primary ml-2.5"
            onClick={handlePreview}
          >
            {intl.formatMessage(messages.previewButton)}
          </Button>
        </nav>
      )}
    />
  );
};

PageSubHeader.propTypes = {
  headerNavigationsActions: PropTypes.shape({
    handleViewLive: PropTypes.func.isRequired,
    handlePreview: PropTypes.func.isRequired,
  }).isRequired,
};

export default PageSubHeader;

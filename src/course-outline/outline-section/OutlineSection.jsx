import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import classNames from 'classnames';
import {
  Icon,
  Dropdown,
  IconButton,
  Truncate, Tooltip, Button, OverlayTrigger,
} from '@edx/paragon';
import {
  ArrowDropDown as ArrowDownIcon,
  MoreVert as MoveVertIcon,
} from '@edx/paragon/icons';

import {
  getSectionStatus,
  getSectionStatusBadgeContent,
} from './utils';
import messages from './messages';
import { SECTION_BADGE_STATUTES } from '../constants';

const OutlineSection = ({ section, children }) => {
  const intl = useIntl();
  const [isExpanded, setIsExpanded] = useState(true);

  const {
    displayName,
    published,
    releasedToStudents,
    visibleToStaffOnly,
    visibilityState,
    staffOnlyMessage,
  } = section;

  const sectionStatus = getSectionStatus({
    published,
    releasedToStudents,
    visibleToStaffOnly,
    visibilityState,
    staffOnlyMessage,
  });

  const { badgeTitle, badgeIcon } = getSectionStatusBadgeContent(sectionStatus, intl);

  return (
    <div className="outline-section">
      <div className="outline-section__header">
        <OverlayTrigger
          placement="bottom-start"
          overlay={(
            <Tooltip
              id={intl.formatMessage(messages.expandTooltip)}
              className="header-tooltip"
            >
              {intl.formatMessage(messages.expandTooltip)}
            </Tooltip>
          )}
        >
          <Button
            iconBefore={ArrowDownIcon}
            variant="tertiary"
            data-testid="header-expanded-btn"
            className={classNames('header-expanded-btn', {
              collapsed: !isExpanded,
            })}
            onClick={() => setIsExpanded((prevState) => !prevState)}
          >
            <Truncate lines={1} className="h3 mb-0">{displayName}</Truncate>
            {badgeTitle && (
              <div className="header-badge-status" data-testid="header-badge-status">
                {badgeIcon && (
                  <Icon
                    src={badgeIcon}
                    size="sm"
                    className={classNames({ 'text-success-500': sectionStatus === SECTION_BADGE_STATUTES.live })}
                  />
                )}
                <span className="small">{badgeTitle}</span>
              </div>
            )}
          </Button>
        </OverlayTrigger>
        <Dropdown data-testid="header-menu" className="ml-auto">
          <Dropdown.Toggle
            className="header-menu"
            id="header-menu"
            as={IconButton}
            src={MoveVertIcon}
            alt="header-menu"
            iconAs={Icon}
            variant="light"
          />
          <Dropdown.Menu>
            <Dropdown.Item>{intl.formatMessage(messages.menuEdit)}</Dropdown.Item>
            <Dropdown.Item>{intl.formatMessage(messages.menuPublish)}</Dropdown.Item>
            <Dropdown.Item>{intl.formatMessage(messages.menuConfigure)}</Dropdown.Item>
            <Dropdown.Item>{intl.formatMessage(messages.menuDuplicate)}</Dropdown.Item>
            <Dropdown.Item>{intl.formatMessage(messages.menuNewSubsection)}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      {isExpanded && (
        <div className="outline-section__content" data-testid="outline-section__content">
          <div className="outline-section__status">
            {/* TODO: add section highlight widget */}
            <h4 className="h4 font-weight-normal">Section status</h4>
          </div>
          {children && (
            <div className="outline-section__subsections">
              {children}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

OutlineSection.defaultProps = {
  children: null,
};

// TODO: add new props
OutlineSection.propTypes = {
  section: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    published: PropTypes.bool.isRequired,
    releasedToStudents: PropTypes.bool.isRequired,
    visibleToStaffOnly: PropTypes.bool.isRequired,
    visibilityState: PropTypes.string.isRequired,
    staffOnlyMessage: PropTypes.bool.isRequired,
  }).isRequired,
  children: PropTypes.node,
};

export default OutlineSection;

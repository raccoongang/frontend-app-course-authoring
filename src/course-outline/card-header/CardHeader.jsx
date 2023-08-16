import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button, Dropdown,
  Icon, IconButton,
  OverlayTrigger,
  Tooltip,
  Truncate,
} from '@edx/paragon';
import {
  ArrowDropDown as ArrowDownIcon,
  MoreVert as MoveVertIcon,
} from '@edx/paragon/icons';
import classNames from 'classnames';

import { SECTION_BADGE_STATUTES } from '../constants';
import { getSectionStatusBadgeContent } from '../utils';
import messages from './messages';

const CardHeader = ({
  title,
  sectionStatus,
  isExpanded,
  handleExpand,
}) => {
  const intl = useIntl();

  const { badgeTitle, badgeIcon } = getSectionStatusBadgeContent(sectionStatus, messages, intl);

  console.log(title);

  return (
    <div className="section-card-header" data-testid="section-card-header">
      <OverlayTrigger
        placement="bottom-start"
        overlay={(
          <Tooltip
            id={intl.formatMessage(messages.expandTooltip)}
            className="section-card-header-tooltip"
          >
            {intl.formatMessage(messages.expandTooltip)}
          </Tooltip>
        )}
      >
        <Button
          iconBefore={ArrowDownIcon}
          variant="tertiary"
          data-testid="section-card-header__expanded-btn"
          className={classNames('section-card-header__expanded-btn', {
            collapsed: !isExpanded,
          })}
          onClick={() => handleExpand((prevState) => !prevState)}
        >
          {title && (
            <Truncate lines={1} className="h3 mb-0">{title}</Truncate>
          )}
          {badgeTitle && (
            <div className="section-card-header__badge-status" data-testid="section-card-header__badge-status">
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
      <Dropdown data-testid="section-card-header__menu" className="ml-auto">
        <Dropdown.Toggle
          className="section-card-header__menu"
          id="section-card-header__menu"
          as={IconButton}
          src={MoveVertIcon}
          alt="section-card-header__menu"
          iconAs={Icon}
        />
        <Dropdown.Menu>
          <Dropdown.Item>{intl.formatMessage(messages.menuEdit)}</Dropdown.Item>
          <Dropdown.Item>{intl.formatMessage(messages.menuPublish)}</Dropdown.Item>
          <Dropdown.Item>{intl.formatMessage(messages.menuConfigure)}</Dropdown.Item>
          <Dropdown.Item>{intl.formatMessage(messages.menuDuplicate)}</Dropdown.Item>
          <Dropdown.Item>{intl.formatMessage(messages.menuDelete)}</Dropdown.Item>
          <Dropdown.Item>{intl.formatMessage(messages.menuNewSubsection)}</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

CardHeader.propTypes = {
  title: PropTypes.string.isRequired,
  sectionStatus: PropTypes.string.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  handleExpand: PropTypes.func.isRequired,
};

export default CardHeader;
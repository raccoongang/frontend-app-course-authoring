import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, OverlayTrigger, Tooltip } from '@edx/paragon';
import {
  Add as IconAdd,
  ArrowDropDown as ArrowDownIcon,
} from '@edx/paragon/icons';

import messages from './messages';

const HeaderNavigations = ({
  headerNavigationsActions,
  isReIndexShow,
  isSectionsExpanded,
  isReindexButtonDisable,
}) => {
  const intl = useIntl();
  const {
    handleNewSection, handleReIndex, handleExpandAll, handleViewLive,
  } = headerNavigationsActions;

  return (
    <nav className="header-navigations ml-auto">
      <OverlayTrigger
        placement="bottom"
        overlay={(
          <Tooltip id={intl.formatMessage(messages.newSectionButtonTooltip)}>
            {intl.formatMessage(messages.newSectionButtonTooltip)}
          </Tooltip>
        )}
      >
        <Button
          iconBefore={IconAdd}
          onClick={handleNewSection}
        >
          {intl.formatMessage(messages.newSectionButton)}
        </Button>
      </OverlayTrigger>
      {isReIndexShow && (
        <OverlayTrigger
          placement="bottom"
          overlay={!isReindexButtonDisable ? (
            <Tooltip id={intl.formatMessage(messages.reindexButtonTooltip)}>
              {intl.formatMessage(messages.reindexButtonTooltip)}
            </Tooltip>
            // eslint-disable-next-line react/jsx-no-useless-fragment
          ) : <></>}
        >
          <Button
            onClick={handleReIndex}
            variant="outline-primary"
            disabled={isReindexButtonDisable}
          >
            {intl.formatMessage(messages.reindexButton)}
          </Button>
        </OverlayTrigger>
      )}
      <Button
        variant="outline-primary"
        className={isSectionsExpanded ? 'expand-button-active' : ''}
        iconBefore={ArrowDownIcon}
        onClick={handleExpandAll}
      >
        {isSectionsExpanded
          ? intl.formatMessage(messages.collapseAllButton)
          : intl.formatMessage(messages.expandAllButton)}
      </Button>
      <OverlayTrigger
        placement="bottom"
        overlay={(
          <Tooltip id={intl.formatMessage(messages.viewLiveButtonTooltip)}>
            {intl.formatMessage(messages.viewLiveButtonTooltip)}
          </Tooltip>
        )}
      >
        <Button
          onClick={handleViewLive}
          variant="outline-primary"
        >
          {intl.formatMessage(messages.viewLiveButton)}
        </Button>
      </OverlayTrigger>
    </nav>
  );
};

HeaderNavigations.propTypes = {
  isReIndexShow: PropTypes.bool.isRequired,
  isSectionsExpanded: PropTypes.bool.isRequired,
  isReindexButtonDisable: PropTypes.bool.isRequired,
  headerNavigationsActions: PropTypes.shape({
    handleNewSection: PropTypes.func.isRequired,
    handleReIndex: PropTypes.func.isRequired,
    handleExpandAll: PropTypes.func.isRequired,
    handleViewLive: PropTypes.func.isRequired,
  }).isRequired,
};

export default HeaderNavigations;

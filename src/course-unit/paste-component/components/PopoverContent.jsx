import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Icon, Popover, Stack } from '@edx/paragon';
import { OpenInNew as OpenInNewIcon } from '@edx/paragon/icons';

import messages from '../messages';

const PopoverContent = ({ clipboardData }) => {
  const intl = useIntl();
  const { sourceEditUrl, content, sourceContextTitle } = clipboardData;
  console.log('sourceEditUrl', sourceEditUrl);
  return (
    <Popover.Title
      className="clipboard-popover-title"
      as={sourceEditUrl ? Link : 'div'}
      to={sourceEditUrl || null}
      target="_blank"
    >
      <Stack>
        <Stack className="justify-content-between" direction="horizontal">
          <strong>{content.displayName}</strong>
          {sourceEditUrl && (
            <Icon className="clipboard-popover-icon m-0" src={OpenInNewIcon} />
          )}
        </Stack>
        <div>
          <small className="clipboard-popover-detail-block-type">
            {content.blockTypeDisplay}
          </small>
          <span>{intl.formatMessage(messages.popoverContentText)} </span>
          <span className="clipboard-popover-detail-course-name">
            {sourceContextTitle}
          </span>
        </div>
      </Stack>
    </Popover.Title>
  );
};

PopoverContent.propTypes = {
  clipboardData: PropTypes.shape({
    sourceEditUrl: PropTypes.string.isRequired,
    content: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      blockTypeDisplay: PropTypes.string.isRequired,
    }).isRequired,
    sourceContextTitle: PropTypes.string.isRequired,
  }).isRequired,
};

export default PopoverContent;

import { Icon, Popover, Stack } from '@edx/paragon';
import { Link } from 'react-router-dom';
import { OpenInNew as OpenInNewIcon } from '@edx/paragon/icons';
import { useSelector } from 'react-redux';
import { getUserClipboardData } from '../../data/selectors';

const PopoverContent = () => {
  const { sourceEditUrl, content, sourceContextTitle } = useSelector(getUserClipboardData);
  const { displayName, blockTypeDisplay } = content;

  return (
    <Popover.Title
      className="clipboard-popover-title"
      as={Link}
      to={sourceEditUrl}
      target="_blank"
    >
      <Stack>
        <Stack className="justify-content-between" direction="horizontal">
          <strong>{displayName}</strong>
          <Icon className="clipboard-popover-icon m-0" src={OpenInNewIcon} />
        </Stack>
        <div>
          <small className="clipboard-popover-detail-block-type">
            {blockTypeDisplay}
          </small>
          <span>From: </span>
          <span className="clipboard-popover-detail-course-name">
            {sourceContextTitle}
          </span>
        </div>
      </Stack>
    </Popover.Title>
  );
};

export default PopoverContent;

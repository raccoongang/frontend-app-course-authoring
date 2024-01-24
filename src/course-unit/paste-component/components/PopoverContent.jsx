import { Icon, Popover, Stack } from '@edx/paragon';
import { Link } from 'react-router-dom';
import { OpenInNew as OpenInNewIcon } from '@edx/paragon/icons';

const PopoverContent = ({ copyXBlockComponentData }) => (
  <Popover.Title
    className="clipboard-popover-title"
    as={Link}
    to={copyXBlockComponentData.sourceEditUrl}
    target="_blank"
  >
    <Stack>
      <Stack className="justify-content-between" direction="horizontal">
        <strong>{copyXBlockComponentData.content.displayName}</strong>
        <Icon className="clipboard-popover-icon m-0" src={OpenInNewIcon} />
      </Stack>
      <div>
        <small className="clipboard-popover-detail-block-type">
          {copyXBlockComponentData.content.blockTypeDisplay}
        </small>
        <span>From: </span>
        <span className="clipboard-popover-detail-course-name">
          {copyXBlockComponentData.sourceContextTitle}
        </span>
      </div>
    </Stack>
  </Popover.Title>
);

export default PopoverContent;

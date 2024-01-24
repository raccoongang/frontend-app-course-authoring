import { Button } from '@edx/paragon';
import { ContentCopy as ContentCopyIcon } from '@edx/paragon/icons';

const PasteComponentButton = ({ handlePastXBlockComponent }) => (
  <Button
    iconBefore={ContentCopyIcon}
    variant="outline-primary"
    block
    onClick={handlePastXBlockComponent}
  >
    Paste component
  </Button>
);

export default PasteComponentButton;

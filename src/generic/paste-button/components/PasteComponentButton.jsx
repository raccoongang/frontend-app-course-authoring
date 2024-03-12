import PropsTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Button } from '@openedx/paragon';
import { ContentCopy as ContentCopyIcon } from '@openedx/paragon/icons';

const PasteComponentButton = ({ onClick, text }) => {
  const { blockId } = useParams();

  const handlePasteXBlockComponent = () => {
    onClick({ stagedContent: 'clipboard', parentLocator: blockId }, null, blockId);
  };

  return (
    <Button
      iconBefore={ContentCopyIcon}
      variant="outline-primary"
      block
      onClick={handlePasteXBlockComponent}
    >
      {text}
    </Button>
  );
};

PasteComponentButton.propTypes = {
  onClick: PropsTypes.func.isRequired,
  text: PropsTypes.string.isRequired,
};

export default PasteComponentButton;

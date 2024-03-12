import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Popover } from '@openedx/paragon';

import { PopoverContent, PasteComponentButton, WhatsInClipboard } from './components';
import { clipboardPropsTypes, OVERLAY_TRIGGERS } from './constants';

const PasteButton = ({
  onClick, clipboardData, text, blockType,
}) => {
  const [showPopover, togglePopover] = useState(false);
  const popoverElementRef = useRef(null);

  const showPasteButton = (
    clipboardData.content?.status === 'ready'
    && clipboardData.content?.blockType === blockType
  );

  if (!showPasteButton) {
    return null;
  }

  const handlePopoverToggle = (isOpen) => togglePopover(isOpen);

  const renderPopover = (props) => (
    <div role="link" ref={popoverElementRef} tabIndex="0">
      <Popover
        className="clipboard-popover"
        id="popover-positioned"
        onMouseEnter={() => handlePopoverToggle(true)}
        onMouseLeave={() => handlePopoverToggle(false)}
        onFocus={() => handlePopoverToggle(true)}
        onBlur={() => handlePopoverToggle(false)}
        {...props}
      >
        {clipboardData && (
          <PopoverContent clipboardData={clipboardData} />
        )}
      </Popover>
    </div>
  );

  return (
    <>
      <PasteComponentButton onClick={onClick} text={text} />
      <OverlayTrigger
        show={showPopover}
        trigger={OVERLAY_TRIGGERS}
        overlay={renderPopover}
      >
        <WhatsInClipboard
          handlePopoverToggle={handlePopoverToggle}
          togglePopover={togglePopover}
          popoverElementRef={popoverElementRef}
        />
      </OverlayTrigger>
    </>
  );
};

PasteButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  clipboardData: PropTypes.shape(clipboardPropsTypes),
  blockType: PropTypes.string,
};

PasteButton.defaultProps = {
  clipboardData: null,
  blockType: null,
};

export default PasteButton;

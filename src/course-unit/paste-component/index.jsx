import { useRef, useState } from 'react';
import { OverlayTrigger, Popover } from '@edx/paragon';

import { PopoverContent, PasteComponentButton, WhatsInClipboard } from './components';

const OVERLAY_TRIGGERS = ['hover', 'focus'];

const PasteComponent = ({ handlePastXBlockComponent }) => {
  const [showPopover, togglePopover] = useState(false);
  const popoverElementRef = useRef(null);

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
        <PopoverContent />
      </Popover>
    </div>
  );

  return (
    <>
      <PasteComponentButton
        handlePastXBlockComponent={handlePastXBlockComponent}
      />
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

export default PasteComponent;

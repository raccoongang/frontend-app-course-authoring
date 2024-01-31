import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Popover } from '@edx/paragon';

import { PopoverContent, PasteComponentButton, WhatsInClipboard } from './components';

const OVERLAY_TRIGGERS = ['hover', 'focus'];

const PasteComponent = ({ handleCreateNewCourseXBlock, clipboardData }) => {
  console.log('clipboardData', clipboardData);
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
        <PopoverContent clipboardData={clipboardData} />
      </Popover>
    </div>
  );

  return (
    <>
      <PasteComponentButton
        handleCreateNewCourseXBlock={handleCreateNewCourseXBlock}
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

PasteComponent.propTypes = {
  handleCreateNewCourseXBlock: PropTypes.func.isRequired,
  clipboardData: PropTypes.shape({
    sourceEditUrl: PropTypes.string.isRequired,
    content: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      blockTypeDisplay: PropTypes.string.isRequired,
    }).isRequired,
    sourceContextTitle: PropTypes.string.isRequired,
  }),
};

PasteComponent.defaultProps = {
  clipboardData: null,
};

export default PasteComponent;

import { useRef } from 'react';
import { Icon } from '@edx/paragon';
import { Question as QuestionIcon } from '@edx/paragon/icons';

const WhatsInClipboard = ({
  handlePopoverToggle, togglePopover, popoverElementRef,
}) => {
  const triggerElementRef = useRef(null);
  return (
    <div
      className="paste-component-whats-in-clipboard mt-2 d-flex align-items-center"
      onMouseEnter={() => handlePopoverToggle(true)}
      onMouseLeave={() => handlePopoverToggle(false)}
      onFocus={() => togglePopover(true)}
      onBlur={() => togglePopover(false)}
    >
      <Icon
        className="paste-component-whats-in-clipboard-icon mr-1"
        src={QuestionIcon}
      />
      <p
        /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
        tabIndex="0"
        role="presentation"
        ref={triggerElementRef}
        className="paste-component-whats-in-clipboard-text m-0"
        onKeyDown={(event) => {
          if (event.key === 'Tab') {
            popoverElementRef.current.focus();
            handlePopoverToggle(true);
          }
        }}
      >
        What&apos;s in my clipboard?
      </p>
    </div>
  );
};

export default WhatsInClipboard;

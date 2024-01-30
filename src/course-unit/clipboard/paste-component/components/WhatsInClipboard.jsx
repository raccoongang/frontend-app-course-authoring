import { useRef } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Icon } from '@edx/paragon';
import { Question as QuestionIcon } from '@edx/paragon/icons';

import messages from '../messages';

const WhatsInClipboard = ({
  handlePopoverToggle, togglePopover, popoverElementRef,
}) => {
  const intl = useIntl();
  const triggerElementRef = useRef(null);

  const handleKeyDown = ({ key }) => {
    if (key === 'Tab') {
      popoverElementRef.current.focus();
      handlePopoverToggle(true);
    }
  };

  return (
    <div
      className="paste-component-whats-in-clipboard mt-2 d-flex align-items-center"
      data-testid="whats-in-clipboard"
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
        onKeyDown={handleKeyDown}
      >
        {intl.formatMessage(messages.pasteComponentWhatsInClipboardText)}
      </p>
    </div>
  );
};

WhatsInClipboard.propTypes = {
  handlePopoverToggle: PropTypes.func.isRequired,
  togglePopover: PropTypes.func.isRequired,
  popoverElementRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]).isRequired,
};

export default WhatsInClipboard;

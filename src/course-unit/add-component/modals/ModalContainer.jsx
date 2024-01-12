import PropTypes from 'prop-types';
import { ActionRow, Button, StandardModal } from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from '../messages';

const ModalContainer = ({
  title, isOpen, close, children, btnText, size, onSubmit,
}) => {
  const intl = useIntl();

  const handleSubmit = () => {
    onSubmit();
    close();
  };

  return (
    <StandardModal
      title={title}
      isOpen={isOpen}
      onClose={close}
      size={size}
      footerNode={(
        <ActionRow>
          <ActionRow.Spacer />
          <Button variant="tertiary" onClick={close}>
            {intl.formatMessage(messages.modalContainerCancelBtnText)}
          </Button>
          <Button onClick={() => handleSubmit()}>
            {btnText}
          </Button>
        </ActionRow>
      )}
    >
      {children}
    </StandardModal>
  );
};

ModalContainer.propTypes = {
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  btnText: PropTypes.string.isRequired,
  size: PropTypes.string,
};

ModalContainer.defaultProps = {
  size: 'md',
};

export default ModalContainer;

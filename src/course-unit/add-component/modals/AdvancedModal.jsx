import PropTypes from 'prop-types';
import { Form } from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from '../messages';
import ModalContainer from './ModalContainer';

const AdvancedModal = ({ isOpen, close }) => {
  const intl = useIntl();

  return (
    <ModalContainer
      isOpen={isOpen}
      close={close}
      title={intl.formatMessage(messages.advancedModalTitle)}
      btnText={intl.formatMessage(messages.advancedModalBtnText)}
    >
      <Form.Group>
        <Form.RadioSet name="Advanced components">
          <Form.Radio className="mb-2.5" value="lti-consumer">LTI Consumer</Form.Radio>
          <Form.Radio className="mb-2.5" value="peer-instruction-question">Peer instruction question</Form.Radio>
          <Form.Radio className="mb-2.5" value="poll">Poll</Form.Radio>
          <Form.Radio className="mb-2.5" value="survey">Survey</Form.Radio>
          <Form.Radio className="mb-2.5" value="word-cloud">Word cloud</Form.Radio>
        </Form.RadioSet>
      </Form.Group>
    </ModalContainer>
  );
};

AdvancedModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.bool.isRequired,
};

export default AdvancedModal;

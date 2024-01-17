import PropTypes from 'prop-types';
import { Form } from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import messages from '../messages';
import ModalContainer from './ModalContainer';
import { updateQueryPendingStatus } from '../../data/slice';

const Modal = ({
  isOpen, close, handleCreateNewXblock, data,
}) => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const [moduleTitle, setModuleTitle] = useState('');
  console.log('DATA ===>', data);
  const handleSubmit = () => {
    handleCreateNewXblock(data.type, moduleTitle);
    dispatch(updateQueryPendingStatus(true));
    // console.log('handleCreateNewXblock ===>', data.type, moduleTitle);
    setModuleTitle('');
  };

  return (
    <ModalContainer
      isOpen={isOpen}
      close={close}
      title={`Add ${data.displayName.toLowerCase()} component`}
      btnText={intl.formatMessage(messages.modalBtnText)}
      onSubmit={handleSubmit}
      resetDisabled={() => setModuleTitle('')}
      hasValue={!moduleTitle.length > 0}
    >
      <Form.Group>
        <Form.RadioSet
          name={data.displayName}
          onChange={(e) => setModuleTitle(e.target.value)}
        >
          {data.templates?.map((componentTemplate) => {
            let value = componentTemplate.category;
            if (componentTemplate.category === 'openassessment') {
              value = componentTemplate.boilerplateName;
            }

            if (componentTemplate.category === 'html') {
              value = componentTemplate.boilerplateName || componentTemplate.category;
            }

            return (
              <Form.Radio
                key={componentTemplate.displayName}
                className="add-component-modal-radio mb-2.5"
                value={value}
              >
                {componentTemplate.displayName}
              </Form.Radio>
            );
          })}
        </Form.RadioSet>
      </Form.Group>
    </ModalContainer>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.bool.isRequired,
};

export default Modal;

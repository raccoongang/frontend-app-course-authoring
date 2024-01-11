import PropTypes from 'prop-types';
import { Form } from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useSelector } from 'react-redux';
import { capitalize } from 'lodash';

import { getAdvancedSettingsModules } from '../../data/selectors';
import { COMPONENT_ICON_TYPES } from '../../constants';
import messages from '../messages';
import ModalContainer from './ModalContainer';

const AdvancedModal = ({ isOpen, close, handleCreateNewXblock }) => {
  const intl = useIntl();
  const advancedSettingsModules = useSelector(getAdvancedSettingsModules);
  const { displayName, value } = advancedSettingsModules;

  return (
    <ModalContainer
      isOpen={isOpen}
      close={close}
      title={intl.formatMessage(messages.advancedModalTitle)}
      btnText={intl.formatMessage(messages.advancedModalBtnText)}
    >
      <Form.Group>
        <Form.RadioSet
          name={displayName}
          onChange={(e) => handleCreateNewXblock(COMPONENT_ICON_TYPES.advanced, e.target.value)}
        >
          {value.map((moduleName) => (
            <Form.Radio key={moduleName} className="mb-2.5" value={moduleName}>
              {capitalize(moduleName.replace(/_/g, ' '))}
            </Form.Radio>
          ))}
        </Form.RadioSet>
      </Form.Group>
    </ModalContainer>
  );
};

AdvancedModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  handleCreateNewXblock: PropTypes.func.isRequired,
};

export default AdvancedModal;

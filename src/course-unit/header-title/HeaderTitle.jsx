import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Form, IconButton, useToggle } from '@edx/paragon';
import {
  EditOutline as EditIcon,
  Settings as SettingsIcon,
} from '@edx/paragon/icons';

import ConfigureModal from '../../generic/configure-modal/ConfigureModal';
import { getCourseUnitData } from '../data/selectors';
import { updateQueryPendingStatus } from '../data/slice';
import messages from './messages';

const HeaderTitle = ({
  unitTitle,
  isEditTitleFormOpen,
  handleTitleEdit,
  handleTitleEditSubmit,
  handleConfigureSubmit,
}) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [titleValue, setTitleValue] = useState(unitTitle);
  const currentItemData = useSelector(getCourseUnitData);
  const [isConfigureModalOpen, openConfigureModal, closeConfigureModal] = useToggle(false);

  const onConfigureSubmit = (...arg) => {
    handleConfigureSubmit(currentItemData.id, ...arg, closeConfigureModal);
  };

  useEffect(() => {
    setTitleValue(unitTitle);
    dispatch(updateQueryPendingStatus(true));
  }, [unitTitle]);

  return (
    <div className="d-flex align-items-center lead">
      {isEditTitleFormOpen ? (
        <Form.Group className="m-0">
          <Form.Control
            ref={(e) => e && e.focus()}
            value={titleValue}
            name="displayName"
            onChange={(e) => setTitleValue(e.target.value)}
            aria-label={intl.formatMessage(messages.ariaLabelButtonEdit)}
            onBlur={() => handleTitleEditSubmit(titleValue)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleTitleEditSubmit(titleValue);
              }
            }}
          />
        </Form.Group>
      ) : unitTitle}
      <IconButton
        alt={intl.formatMessage(messages.altButtonEdit)}
        className="ml-1 flex-shrink-0"
        iconAs={EditIcon}
        onClick={handleTitleEdit}
      />
      <IconButton
        alt={intl.formatMessage(messages.altButtonSettings)}
        className="flex-shrink-0"
        iconAs={SettingsIcon}
        onClick={openConfigureModal}
      />
      <ConfigureModal
        isOpen={isConfigureModalOpen}
        onClose={closeConfigureModal}
        onConfigureSubmit={onConfigureSubmit}
        currentItemData={currentItemData}
      />
    </div>
  );
};

HeaderTitle.propTypes = {
  unitTitle: PropTypes.string.isRequired,
  isEditTitleFormOpen: PropTypes.bool.isRequired,
  handleTitleEdit: PropTypes.func.isRequired,
  handleTitleEditSubmit: PropTypes.func.isRequired,
  handleConfigureSubmit: PropTypes.func.isRequired,
};

export default HeaderTitle;

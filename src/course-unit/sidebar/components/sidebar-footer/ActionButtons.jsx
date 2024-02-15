import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import { getCanEdit, getCourseUnitData } from '../../../data/selectors';
import { copyToClipboard } from '../../../data/thunk';
import messages from '../../messages';

const ActionButtons = ({ openDiscardModal, handlePublishing }) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const {
    id,
    published,
    hasChanges,
    enableCopyPasteUnits,
  } = useSelector(getCourseUnitData);
  const canEdit = useSelector(getCanEdit);

  return (
    <>
      {(!published || hasChanges) && (
        <Button size="sm" className="mt-3.5" variant="outline-primary" onClick={handlePublishing}>
          {intl.formatMessage(messages.actionButtonPublishTitle)}
        </Button>
      )}
      {(published && hasChanges) && (
        <Button size="sm" variant="link" onClick={openDiscardModal} className="mt-2">
          {intl.formatMessage(messages.actionButtonDiscardChangesTitle)}
        </Button>
      )}
      {enableCopyPasteUnits && canEdit && (
        <Button
          onClick={() => dispatch(copyToClipboard(id))}
          className="mt-2"
          variant="outline-primary"
          size="sm"
        >
          {intl.formatMessage(messages.actionButtonCopyUnitTitle)}
        </Button>
      )}
    </>
  );
};

ActionButtons.propTypes = {
  openDiscardModal: PropTypes.func.isRequired,
  handlePublishing: PropTypes.func.isRequired,
};

export default ActionButtons;

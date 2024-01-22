import { useSelector } from 'react-redux';
import { Button } from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import { getCourseUnitData } from '../../../data/selectors';
import messages from '../../messages';

const ActionButtons = ({ open, handlePublish }) => {
  const intl = useIntl();
  const {
    published,
    hasChanges,
    enableCopyPasteUnits,
  } = useSelector(getCourseUnitData);

  return (
    <>
      {(!published || hasChanges) && (
        <Button
          className="mt-3.5"
          variant="outline-primary"
          size="sm"
          onClick={handlePublish}
        >
          {intl.formatMessage(messages.actionButtonPublishTitle)}
        </Button>
      )}
      {(published && hasChanges) && (
        <Button
          className="mt-2"
          variant="link"
          size="sm"
          onClick={open}
        >
          {intl.formatMessage(messages.actionButtonDiscardChangesTitle)}
        </Button>
      )}
      {enableCopyPasteUnits && (
        <Button
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

export default ActionButtons;

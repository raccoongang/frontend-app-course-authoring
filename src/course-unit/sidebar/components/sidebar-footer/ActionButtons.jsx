import { useSelector } from 'react-redux';
import { Button } from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import { getCourseUnitData } from '../../../data/selectors';
import messages from '../../messages';

const ActionButtons = () => {
  const intl = useIntl();
  const {
    published,
    hasChanges,
    enableCopyPasteUnits,
  } = useSelector(getCourseUnitData);

  return (
    <>
      {/* TODO: Sidebar functionality will be added to: https://youtrack.raccoongang.com/issue/AXIMST-24 */}
      {(!published || hasChanges) && (
        <Button
          className="mt-3.5"
          variant="outline-primary"
          size="sm"
        >
          {intl.formatMessage(messages.actionButtonPublishTitle)}
        </Button>
      )}
      {(published && hasChanges) && (
        <Button
          className="mt-2"
          variant="link"
          size="sm"
        >
          {intl.formatMessage(messages.actionButtonDiscardChangesTitle)}
        </Button>
      )}
      {/* TODO: Unit copying functionality will be added to: https://youtrack.raccoongang.com/issue/AXIMST-375 */}
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

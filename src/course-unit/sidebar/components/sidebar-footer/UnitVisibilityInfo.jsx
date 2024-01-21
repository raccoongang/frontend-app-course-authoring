import { useSelector } from 'react-redux';
import { Form } from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import { getCourseUnitData } from '../../../data/selectors';
import { getVisibilityTitle } from '../../utils';
import messages from '../../messages';

const UnitVisibilityInfo = () => {
  const intl = useIntl();
  const {
    published,
    hasChanges,
    staffLockFrom,
    releaseDateFrom,
    releasedToStudents,
    visibleToStaffOnly,
    hasExplicitStaffLock,
  } = useSelector(getCourseUnitData);

  return (
    <>
      <small className="course-unit-sidebar-visibility-title">
        {getVisibilityTitle(intl, releasedToStudents, published, hasChanges)}
      </small>
      {visibleToStaffOnly ? (
        <>
          <h6 className="course-unit-sidebar-visibility-copy">
            {intl.formatMessage(messages.visibilityStaffOnlyTitle)}
          </h6>
          {!hasExplicitStaffLock && (
            <span>
              {intl.formatMessage(messages.visibilityHasExplicitStaffLockText, {
                date: releaseDateFrom, sectionName: staffLockFrom,
              })}
            </span>
          )}
        </>
      ) : (
        <h6 className="course-unit-sidebar-visibility-copy">
          {intl.formatMessage(messages.visibilityStaffAndLearnersTitle)}
        </h6>
      )}
      {/* TODO: Sidebar functionality will be added to: https://youtrack.raccoongang.com/issue/AXIMST-24 */}
      <Form.Checkbox
        className="course-unit-sidebar-visibility-checkbox"
        checked={hasExplicitStaffLock}
      >
        {intl.formatMessage(messages.visibilityCheckboxTitle)}
      </Form.Checkbox>
    </>
  );
};

export default UnitVisibilityInfo;

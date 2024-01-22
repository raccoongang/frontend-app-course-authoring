import { useDispatch, useSelector } from 'react-redux';
import { Form } from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import { useParams } from 'react-router-dom';
import { getCourseUnitData } from '../../../data/selectors';
import { getVisibilityTitle } from '../../utils';
import messages from '../../messages';
import { editVisibleToStaffOnly } from '../../../data/thunk';

const UnitVisibilityInfo = ({ openVisibleModal }) => {
  const intl = useIntl();
  const { blockId } = useParams();
  const dispatch = useDispatch();
  const {
    published,
    hasChanges,
    staffLockFrom,
    releaseDateFrom,
    releasedToStudents,
    visibleToStaffOnly,
    hasExplicitStaffLock,
    id,
  } = useSelector(getCourseUnitData);

  const handleChange = () => {
    const bodySetCheck = {
      id,
      data: null,
      metadata: {
        visible_to_staff_only: true,
      },
    };

    return dispatch(editVisibleToStaffOnly(blockId, bodySetCheck));
  };

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
      <Form.Checkbox
        className="course-unit-sidebar-visibility-checkbox"
        checked={hasExplicitStaffLock}
        onChange={hasExplicitStaffLock ? null : handleChange}
        onClick={hasExplicitStaffLock ? openVisibleModal : null}
      >
        {intl.formatMessage(messages.visibilityCheckboxTitle)}
      </Form.Checkbox>
    </>
  );
};

export default UnitVisibilityInfo;

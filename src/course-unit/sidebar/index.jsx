import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { Card, useToggle } from '@edx/paragon';

import { getCourseUnitData } from '../data/selectors';
import { SidebarBody, SidebarFooter, SidebarHeader } from './components';
import useCourseUnitData from './hooks';
import { editVisibleToStaffOnly } from '../data/thunk';
import ModalNotification from '../../generic/modal-notification';
import { PUBLISH_TYPES } from '../constants';
import { updateQueryPendingStatus } from '../data/slice';

const Sidebar = ({ blockId, isDisplayUnitLocation }) => {
  const {
    title,
    locationId,
    releaseLabel,
    visibilityState,
    visibleToStaffOnly,
  } = useCourseUnitData(useSelector(getCourseUnitData));
  const dispatch = useDispatch();
  const [isOpenDiscardModal, openDiscardModal, closeDiscardModal] = useToggle(false);
  const [isOpenVisibleModal, openVisibleModal, closeVisibleModal] = useToggle(false);

  const handleDiscardModalChange = () => {
    dispatch(updateQueryPendingStatus(true));
    closeVisibleModal();
    return dispatch(editVisibleToStaffOnly(blockId, PUBLISH_TYPES.republish, null));
  };

  const discardChanges = () => {
    dispatch(updateQueryPendingStatus(true));
    closeDiscardModal();
    return dispatch(editVisibleToStaffOnly(blockId, PUBLISH_TYPES.discardChanges));
  };

  const handlePublish = () => {
    dispatch(updateQueryPendingStatus(true));
    return dispatch(editVisibleToStaffOnly(blockId, PUBLISH_TYPES.makePublic));
  };

  return (
    <Card
      className={classNames('course-unit-sidebar', {
        'is-stuff-only': visibleToStaffOnly,
      })}
      data-testid="course-unit-sidebar"
    >
      <SidebarHeader
        title={title}
        visibilityState={visibilityState}
        isDisplayUnitLocation={isDisplayUnitLocation}
      />
      <SidebarBody
        locationId={locationId}
        releaseLabel={releaseLabel}
        isDisplayUnitLocation={isDisplayUnitLocation}
      />
      <SidebarFooter
        locationId={locationId}
        isDisplayUnitLocation={isDisplayUnitLocation}
        open={openDiscardModal}
        openVisibleModal={openVisibleModal}
        handleChange={handleDiscardModalChange}
        handlePublish={handlePublish}
      />
      <ModalNotification
        title="Discard changes"
        isOpen={isOpenDiscardModal}
        actionButtonText="Discard changes"
        cancelButtonText="Cancel"
        handleAction={discardChanges}
        handleCancel={closeDiscardModal}
        message="Are you sure you want to revert to the last published version of the unit? You cannot undo this action."
        variant="warning"
      />
      <ModalNotification
        title="Make visible to students"
        isOpen={isOpenVisibleModal}
        actionButtonText="Make visible to students"
        cancelButtonText="Cancel"
        handleAction={handleDiscardModalChange}
        handleCancel={closeVisibleModal}
        message="If the unit was previously published and released to students, any changes you made to the unit when it was hidden will now be visible to students. Do you want to proceed?"
        variant="warning"
      />
    </Card>
  );
};

Sidebar.propTypes = {
  isDisplayUnitLocation: PropTypes.bool,
};

Sidebar.defaultProps = {
  isDisplayUnitLocation: false,
};

export default Sidebar;

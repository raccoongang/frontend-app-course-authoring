import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import {
  ActionRow, AlertModal, Button, Card, useToggle,
} from '@edx/paragon';

import { getCourseUnitData } from '../data/selectors';
import { SidebarBody, SidebarFooter, SidebarHeader } from './components';
import useCourseUnitData from './hooks';
import { editVisibleToStaffOnly } from '../data/thunk';

const Sidebar = ({ blockId, isDisplayUnitLocation }) => {
  const {
    id,
    title,
    locationId,
    releaseLabel,
    visibilityState,
    visibleToStaffOnly,
  } = useCourseUnitData(useSelector(getCourseUnitData));
  const dispatch = useDispatch();
  const [isOpenDiscardModal, openDiscardModal, closeDiscardModal] = useToggle(false);
  const [isOpenVisibleModal, openVisibleModal, closeVisibleModal] = useToggle(false);

  const handleChange = () => {
    const bodySetUnCheck = {
      publish: 'republish',
      metadata: {
        visible_to_staff_only: null,
      },
    };
    closeVisibleModal();
    return dispatch(editVisibleToStaffOnly(blockId, bodySetUnCheck));
  };

  const discardChanges = () => {
    const body = {
      publish: 'discard_changes',
    };
    closeDiscardModal();
    return dispatch(editVisibleToStaffOnly(blockId, body));
  };

  const handlePublish = () => {
    const body = {
      publish: 'make_public',
    };

    return dispatch(editVisibleToStaffOnly(blockId, body));
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
        handleChange={handleChange}
        handlePublish={handlePublish}
      />
      <AlertModal
        title="Discard changes"
        isOpen={isOpenDiscardModal}
        onClose={closeDiscardModal}
        footerNode={(
          <ActionRow>
            <Button variant="tertiary" onClick={closeDiscardModal}>Cancel</Button>
            <Button variant="danger" onClick={discardChanges}>Discard changes</Button>
          </ActionRow>
        )}
      >
        <p>
          Are you sure you want to revert to the last published version of the unit? You cannot undo this action.
        </p>
      </AlertModal>
      <AlertModal
        title="Make visible to students"
        isOpen={isOpenVisibleModal}
        onClose={closeVisibleModal}
        footerNode={(
          <ActionRow>
            <Button variant="tertiary" onClick={closeVisibleModal}>Cancel</Button>
            <Button variant="danger" onClick={handleChange}>Make visible to students</Button>
          </ActionRow>
        )}
      >
        <p>
          If the unit was previously published and released to students, any changes you made to the unit when it was
          hidden will now be visible to students. Do you want to proceed?
        </p>
      </AlertModal>
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

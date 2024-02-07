/* eslint-disable import/named */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  ModalDialog,
  Button,
  ActionRow,
  Tab,
  Tabs,
  useCheckboxSetValues,
} from '@edx/paragon';

import { VisibilityTypes } from '../../data/constants';
import { COURSE_BLOCK_NAMES } from '../../constants';
import messages from './messages';
import BasicTab from './BasicTab';
import VisibilityTab from './VisibilityTab';
import AdvancedTab from './AdvancedTab';
import UnitTab from './UnitTab';

const ConfigureModal = ({
  isOpen,
  onClose,
  onConfigureSubmit,
  currentItemData,
  isXBlockComponent,
}) => {
  const intl = useIntl();
  const {
    displayName,
    start: sectionStartDate,
    visibilityState,
    due,
    isTimeLimited,
    defaultTimeLimitMinutes,
    hideAfterDue,
    showCorrectness,
    courseGraders,
    category,
    format,
    userPartitionInfo,
    ancestorHasStaffLock,
  } = currentItemData;

  const [releaseDate, setReleaseDate] = useState(sectionStartDate);
  const [isVisibleToStaffOnly, setIsVisibleToStaffOnly] = useState(visibilityState === VisibilityTypes.STAFF_ONLY);

  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
  const [graderType, setGraderType] = useState(format == null ? 'Not Graded' : format);
  const [dueDateState, setDueDateState] = useState(due == null ? '' : due);
  const [isTimeLimitedState, setIsTimeLimitedState] = useState(false);
  const [defaultTimeLimitMin, setDefaultTimeLimitMin] = useState(defaultTimeLimitMinutes);
  const [hideAfterDueState, setHideAfterDueState] = useState(hideAfterDue === undefined ? false : hideAfterDue);
  const [showCorrectnessState, setShowCorrectnessState] = useState(false);
  const isSubsection = category === COURSE_BLOCK_NAMES.sequential.id;

  /* TODO: The use of these useEffects needs to be updated to use Formik, please see,
  * https://github.com/open-craft/frontend-app-course-authoring/pull/22#discussion_r1435957797 as reference. */
  // by default it is -1 i.e. accessible to all learners & staff
  const [selectedPartitionIndex, setSelectedPartitionIndex] = useState(userPartitionInfo?.selectedPartitionIndex);
  const getSelectedGroups = () => {
    if (selectedPartitionIndex >= 0) {
      return userPartitionInfo?.selectablePartitions[selectedPartitionIndex]
        ?.groups
        .filter(({ selected }) => selected)
        .map(({ id }) => `${id}`)
        || [];
    }
    return [];
  };

  const [selectedGroups, { add, remove, set }] = useCheckboxSetValues([]);

  useEffect(() => {
    setSelectedPartitionIndex(userPartitionInfo?.selectedPartitionIndex);
  }, [userPartitionInfo]);

  useEffect(() => {
    set(getSelectedGroups());
  }, [selectedPartitionIndex, userPartitionInfo]);

  useEffect(() => {
    setReleaseDate(sectionStartDate);
  }, [sectionStartDate]);

  useEffect(() => {
    setGraderType(format == null ? 'Not Graded' : format);
  }, [format]);

  useEffect(() => {
    setDueDateState(due == null ? '' : due);
  }, [due]);

  useEffect(() => {
    setIsTimeLimitedState(isTimeLimited);
  }, [isTimeLimited]);

  useEffect(() => {
    setDefaultTimeLimitMin(defaultTimeLimitMinutes);
  }, [defaultTimeLimitMinutes]);

  useEffect(() => {
    setHideAfterDueState(hideAfterDue === undefined ? false : hideAfterDue);
  }, [hideAfterDue]);

  useEffect(() => {
    setShowCorrectnessState(showCorrectness);
  }, [showCorrectness]);

  useEffect(() => {
    setIsVisibleToStaffOnly(visibilityState === VisibilityTypes.STAFF_ONLY);
  }, [visibilityState]);

  useEffect(() => {
    const visibilityUnchanged = isVisibleToStaffOnly === (visibilityState === VisibilityTypes.STAFF_ONLY);
    const graderTypeUnchanged = graderType === (format == null ? 'Not Graded' : format);
    const dueDateUnchanged = dueDateState === (due == null ? '' : due);
    const hideAfterDueUnchanged = hideAfterDueState === (hideAfterDue === undefined ? false : hideAfterDue);
    const selectedGroupsUnchanged = selectedGroups.sort().join(',') === getSelectedGroups().sort().join(',');
    // handle the case of unrestricting access
    const accessRestrictionUnchanged = selectedPartitionIndex !== -1
                                         || userPartitionInfo?.selectedPartitionIndex === -1;
    setSaveButtonDisabled(
      visibilityUnchanged
      && releaseDate === sectionStartDate
      && dueDateUnchanged
      && isTimeLimitedState === isTimeLimited
      && defaultTimeLimitMin === defaultTimeLimitMinutes
      && hideAfterDueUnchanged
      && showCorrectnessState === showCorrectness
      && graderTypeUnchanged
      && selectedGroupsUnchanged
      && accessRestrictionUnchanged,
    );
  }, [
    releaseDate,
    isVisibleToStaffOnly,
    dueDateState,
    isTimeLimitedState,
    defaultTimeLimitMin,
    hideAfterDueState,
    showCorrectnessState,
    graderType,
    selectedGroups,
  ]);

  const dialogTitle = isXBlockComponent
    ? intl.formatMessage(messages.componentTitle, { title: displayName })
    : intl.formatMessage(messages.title, { title: displayName });

  const handleSave = () => {
    const groupAccess = {};
    switch (category) {
    case COURSE_BLOCK_NAMES.chapter.id:
      onConfigureSubmit(isVisibleToStaffOnly, releaseDate);
      break;
    case COURSE_BLOCK_NAMES.sequential.id:
      onConfigureSubmit(
        isVisibleToStaffOnly,
        releaseDate,
        graderType === 'Not Graded' ? 'notgraded' : graderType,
        dueDateState,
        isTimeLimitedState,
        defaultTimeLimitMin,
        hideAfterDueState,
        showCorrectnessState,
      );
      break;
    case COURSE_BLOCK_NAMES.vertical.id:
    case COURSE_BLOCK_NAMES.component.id:
      // groupAccess should be {partitionId: [group1, group2]} or {} if selectedPartitionIndex === -1
      if (selectedPartitionIndex >= 0) {
        const partitionId = userPartitionInfo.selectablePartitions[selectedPartitionIndex].id;
        groupAccess[partitionId] = selectedGroups.map(g => parseInt(g, 10));
      }
      onConfigureSubmit(isVisibleToStaffOnly, groupAccess);
      break;
    default:
      break;
    }
  };

  const renderModalBody = () => {
    switch (category) {
    case COURSE_BLOCK_NAMES.chapter.id:
      return (
        <Tabs>
          <Tab eventKey="basic" title={intl.formatMessage(messages.basicTabTitle)}>
            <BasicTab
              releaseDate={releaseDate}
              setReleaseDate={setReleaseDate}
              isSubsection={isSubsection}
              graderType={graderType}
              courseGraders={courseGraders === 'undefined' ? [] : courseGraders}
              setGraderType={setGraderType}
              dueDate={dueDateState}
              setDueDate={setDueDateState}
            />
          </Tab>
          <Tab eventKey="visibility" title={intl.formatMessage(messages.visibilityTabTitle)}>
            <VisibilityTab
              category={category}
              isSubsection={isSubsection}
              isVisibleToStaffOnly={isVisibleToStaffOnly}
              setIsVisibleToStaffOnly={setIsVisibleToStaffOnly}
              showWarning={visibilityState === VisibilityTypes.STAFF_ONLY}
              hideAfterDue={hideAfterDueState}
              setHideAfterDue={setHideAfterDueState}
              showCorrectness={showCorrectnessState}
              setShowCorrectness={setShowCorrectnessState}
            />
          </Tab>
        </Tabs>
      );
    case COURSE_BLOCK_NAMES.sequential.id:
      return (
        <Tabs>
          <Tab eventKey="basic" title={intl.formatMessage(messages.basicTabTitle)}>
            <BasicTab
              releaseDate={releaseDate}
              setReleaseDate={setReleaseDate}
              isSubsection={isSubsection}
              graderType={graderType}
              courseGraders={courseGraders === 'undefined' ? [] : courseGraders}
              setGraderType={setGraderType}
              dueDate={dueDateState}
              setDueDate={setDueDateState}
            />
          </Tab>
          <Tab eventKey="visibility" title={intl.formatMessage(messages.visibilityTabTitle)}>
            <VisibilityTab
              category={category}
              isSubsection={isSubsection}
              isVisibleToStaffOnly={isVisibleToStaffOnly}
              setIsVisibleToStaffOnly={setIsVisibleToStaffOnly}
              showWarning={visibilityState === VisibilityTypes.STAFF_ONLY}
              hideAfterDue={hideAfterDueState}
              setHideAfterDue={setHideAfterDueState}
              showCorrectness={showCorrectnessState}
              setShowCorrectness={setShowCorrectnessState}
            />
          </Tab>
          <Tab eventKey="advanced" title={intl.formatMessage(messages.advancedTabTitle)}>
            <AdvancedTab
              isTimeLimited={isTimeLimitedState}
              setIsTimeLimited={setIsTimeLimitedState}
              defaultTimeLimit={defaultTimeLimitMin}
              setDefaultTimeLimit={setDefaultTimeLimitMin}
            />
          </Tab>
        </Tabs>
      );
    case COURSE_BLOCK_NAMES.vertical.id:
    case COURSE_BLOCK_NAMES.component.id:
      return (
        <UnitTab
          isXBlockComponent={COURSE_BLOCK_NAMES.component.id === category}
          isVisibleToStaffOnly={isVisibleToStaffOnly}
          setIsVisibleToStaffOnly={setIsVisibleToStaffOnly}
          showWarning={visibilityState === VisibilityTypes.STAFF_ONLY && !ancestorHasStaffLock}
          userPartitionInfo={userPartitionInfo}
          selectedPartitionIndex={selectedPartitionIndex}
          setSelectedPartitionIndex={setSelectedPartitionIndex}
          selectedGroups={selectedGroups}
          add={add}
          remove={remove}
        />
      );
    default:
      return null;
    }
  };

  return (
    isOpen && (
      <ModalDialog
        className="configure-modal"
        isOpen={isOpen}
        onClose={onClose}
        hasCloseButton
        isFullscreenOnMobile
      >
        <div data-testid="configure-modal">
          <ModalDialog.Header className="configure-modal__header">
            <ModalDialog.Title>
              {dialogTitle}
            </ModalDialog.Title>
          </ModalDialog.Header>
          <ModalDialog.Body className="configure-modal__body">
            {renderModalBody(category)}
          </ModalDialog.Body>
          <ModalDialog.Footer className="pt-1">
            <ActionRow>
              <ModalDialog.CloseButton variant="tertiary">
                {intl.formatMessage(messages.cancelButton)}
              </ModalDialog.CloseButton>
              <Button data-testid="configure-save-button" onClick={handleSave} disabled={saveButtonDisabled}>
                {intl.formatMessage(messages.saveButton)}
              </Button>
            </ActionRow>
          </ModalDialog.Footer>
        </div>
      </ModalDialog>
    )
  );
};

ConfigureModal.defaultProps = {
  isXBlockComponent: false,
};

ConfigureModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfigureSubmit: PropTypes.func.isRequired,
  currentItemData: PropTypes.shape({
    displayName: PropTypes.string,
    start: PropTypes.string,
    visibilityState: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    due: PropTypes.string,
    isTimeLimited: PropTypes.bool,
    defaultTimeLimitMinutes: PropTypes.number,
    hideAfterDue: PropTypes.bool,
    showCorrectness: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    courseGraders: PropTypes.arrayOf(PropTypes.string),
    category: PropTypes.string,
    format: PropTypes.string,
    userPartitionInfo: PropTypes.shape({
      selectablePartitions: PropTypes.arrayOf(PropTypes.shape({
        groups: PropTypes.arrayOf(PropTypes.shape({
          deleted: PropTypes.bool,
          id: PropTypes.number,
          name: PropTypes.string,
          selected: PropTypes.bool,
        })),
        id: PropTypes.number,
        name: PropTypes.string,
        scheme: PropTypes.string,
      })),
      selectedPartitionIndex: PropTypes.number,
      selectedGroupsLabel: PropTypes.string,
    }),
    ancestorHasStaffLock: PropTypes.bool,
  }).isRequired,
  isXBlockComponent: PropTypes.bool,
};

export default ConfigureModal;
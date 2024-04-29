import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  alertFailedGeneric: {
    id: 'course-authoring.course-unit.xblock.alert.error.description',
    defaultMessage: 'Unable to {actionName} {type}. Please try again.',
  },
  alertUnpublishedVersion: {
    id: 'course-authoring.course-unit.xblock.alert.unpublished-version.description',
    defaultMessage: 'Note: The last published version of this unit is live. By publishing changes you will change the student experience.',
  },
  pasteButtonText: {
    id: 'course-authoring.course-unit.paste-component.btn.text',
    defaultMessage: 'Paste component',
  },
  collapseAllButton: {
    id: 'course-authoring.course-unit.xblocks.button.collapse-all',
    defaultMessage: 'Collapse all',
  },
  expandAllButton: {
    id: 'course-authoring.course-unit.xblocks.button.expand-all',
    defaultMessage: 'Expand all',
  },
  alertMoveSuccessTitle: {
    id: 'course-authoring.course-unit.alert.xblock.move.success.title',
    defaultMessage: 'Success!',
  },
  alertMoveSuccessDescription: {
    id: 'course-authoring.course-unit.alert.xblock.move.success.description',
    defaultMessage: '{title} has been moved.',
  },
  alertMoveCancelTitle: {
    id: 'course-authoring.course-unit.alert.xblock.move.cancel.title',
    defaultMessage: 'Move cancelled.',
  },
  alertMoveCancelDescription: {
    id: 'course-authoring.course-unit.alert.xblock.move.cancel.description',
    defaultMessage: '{title} has been moved back to its original location.',
  },
  undoMoveButton: {
    id: 'course-authoring.course-unit.alert.xblock.move.undo.btn.text',
    defaultMessage: 'Undo move',
  },
  newLocationButton: {
    id: 'course-authoring.course-unit.alert.xblock.new.location.btn.text',
    defaultMessage: 'Take me to the new location',
  },
});

export default messages;

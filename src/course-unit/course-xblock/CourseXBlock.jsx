import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  ActionRow, Card, Dropdown, Icon, IconButton, useToggle,
} from '@openedx/paragon';
import { EditOutline as EditIcon, MoreVert as MoveVertIcon } from '@openedx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';

import { getCanEdit, getCourseId } from 'CourseAuthoring/course-unit/data/selectors';
import DeleteModal from '../../generic/delete-modal/DeleteModal';
import ConfigureModal from '../../generic/configure-modal/ConfigureModal';
import ConditionalSortableElement from '../../generic/drag-helper/ConditionalSortableElement';
import { scrollToElement } from '../../course-outline/utils';
import { COURSE_BLOCK_NAMES } from '../../constants';
import { copyToClipboard } from '../../generic/data/thunks';
import { COMPONENT_TYPES } from '../constants';
import XBlockMessages from './xblock-messages/XBlockMessages';
import ContentIFrame from './ContentIFrame';
import { getIFrameUrl } from './urls';
import messages from './messages';

const CourseXBlock = ({
  id, title, type, unitXBlockActions, shouldScroll, userPartitionInfo,
  handleConfigureSubmit, validationMessages, ...props
}) => {
  const courseXBlockElementRef = useRef(null);
  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useToggle(false);
  const [isConfigureModalOpen, openConfigureModal, closeConfigureModal] = useToggle(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const canEdit = useSelector(getCanEdit);
  const courseId = useSelector(getCourseId);
  const intl = useIntl();
  const iframeUrl = getIFrameUrl({ blockId: id });

  const visibilityMessage = userPartitionInfo.selectedGroupsLabel
    ? intl.formatMessage(messages.visibilityMessage, { selectedGroupsLabel: userPartitionInfo.selectedGroupsLabel })
    : null;

  const currentItemData = {
    category: COURSE_BLOCK_NAMES.component.id,
    displayName: title,
    userPartitionInfo,
    showCorrectness: 'always',
  };

  const onDeleteSubmit = () => {
    unitXBlockActions.handleDelete(id);
    closeDeleteModal();
  };

  const handleEdit = () => {
    switch (type) {
    case COMPONENT_TYPES.html:
    case COMPONENT_TYPES.problem:
    case COMPONENT_TYPES.video:
      navigate(`/course/${courseId}/editor/${type}/${id}`);
      break;
    default:
    }
  };

  const onConfigureSubmit = (...arg) => {
    handleConfigureSubmit(id, ...arg, closeConfigureModal);
  };

  useEffect(() => {
    // if this item has been newly added, scroll to it.
    if (courseXBlockElementRef.current && shouldScroll) {
      scrollToElement(courseXBlockElementRef.current);
    }
  }, []);

  return (
    <div ref={courseXBlockElementRef} {...props}>
      <Card as={ConditionalSortableElement} id={id} draggable className="mb-1">
        <Card.Header
          title={title}
          subtitle={visibilityMessage}
          actions={(
            <ActionRow>
              <IconButton
                alt={intl.formatMessage(messages.blockAltButtonEdit)}
                iconAs={EditIcon}
                onClick={handleEdit}
              />
              <Dropdown>
                <Dropdown.Toggle
                  id={id}
                  as={IconButton}
                  src={MoveVertIcon}
                  alt={intl.formatMessage(messages.blockActionsDropdownAlt)}
                  iconAs={Icon}
                />
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => unitXBlockActions.handleDuplicate(id)}>
                    {intl.formatMessage(messages.blockLabelButtonDuplicate)}
                  </Dropdown.Item>
                  <Dropdown.Item>
                    {intl.formatMessage(messages.blockLabelButtonMove)}
                  </Dropdown.Item>
                  {canEdit && (
                    <Dropdown.Item onClick={() => dispatch(copyToClipboard(id))}>
                      {intl.formatMessage(messages.blockLabelButtonCopyToClipboard)}
                    </Dropdown.Item>
                  )}
                  <Dropdown.Item onClick={openConfigureModal}>
                    {intl.formatMessage(messages.blockLabelButtonManageAccess)}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={openDeleteModal}>
                    {intl.formatMessage(messages.blockLabelButtonDelete)}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <DeleteModal
                category="component"
                isOpen={isDeleteModalOpen}
                close={closeDeleteModal}
                onDeleteSubmit={onDeleteSubmit}
              />
              <ConfigureModal
                isXBlockComponent
                isOpen={isConfigureModalOpen}
                onClose={closeConfigureModal}
                onConfigureSubmit={onConfigureSubmit}
                currentItemData={currentItemData}
              />
            </ActionRow>
          )}
        />
        <Card.Section>
          <ContentIFrame id={id} title={title} elementId={id} iframeUrl={iframeUrl} />
        </Card.Section>
      </Card>
    </div>
  );
};

CourseXBlock.defaultProps = {
  validationMessages: [],
  shouldScroll: false,
};

CourseXBlock.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  shouldScroll: PropTypes.bool,
  validationMessages: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string,
    text: PropTypes.string,
  })),
  unitXBlockActions: PropTypes.shape({
    handleDelete: PropTypes.func,
    handleDuplicate: PropTypes.func,
  }).isRequired,
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
  }).isRequired,
  handleConfigureSubmit: PropTypes.func.isRequired,
};

export default CourseXBlock;

import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  ActionRow, Card, Dropdown, Icon, IconButton, useToggle, Sheet,
} from '@openedx/paragon';
import { EditOutline as EditIcon, MoreVert as MoveVertIcon } from '@openedx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { find } from 'lodash';
import { createPortal } from 'react-dom';

import { getConfig } from '@edx/frontend-platform';
import { useOverflowControl } from '../../generic/hooks';
import ContentTagsDrawer from '../../content-tags-drawer/ContentTagsDrawer';
import { useContentTagsCount } from '../../generic/data/apiHooks';
import TagCount from '../../generic/tag-count';
import DeleteModal from '../../generic/delete-modal/DeleteModal';
import ConfigureModal from '../../generic/configure-modal/ConfigureModal';
import SortableItem from '../../generic/drag-helper/SortableItem';
import { scrollToElement } from '../../course-outline/utils';
import { COURSE_BLOCK_NAMES } from '../../constants';
import {
  getCourseId,
  getXBlockIFrameHtmlAndResources,
} from '../data/selectors';
import {
  copyToClipboard,
} from '../../generic/data/thunks';
import { getHandlerUrl } from '../data/api';
import {
  fetchCourseVerticalChildrenData,
  fetchXBlockIFrameHtmlAndResourcesQuery,
} from '../data/thunk';
import { COMPONENT_TYPES } from '../constants';
import XBlockMessages from './xblock-messages/XBlockMessages';
import RenderErrorAlert from './render-error-alert';
import { XBlockContent } from './xblock-content';
import messages from './messages';
import { extractStylesWithContent } from './utils';
import { IFRAME_FEATURE_POLICY } from './constants';

const CourseXBlock = ({
  id, title, type, unitXBlockActions, shouldScroll, userPartitionInfo,
  handleConfigureSubmit, validationMessages, renderError, actions, blockId, ...props
}) => {
  const courseXBlockElementRef = useRef(null);
  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useToggle(false);
  const [isConfigureModalOpen, openConfigureModal, closeConfigureModal] = useToggle(false);
  const [isManageTagsOpen, openManageTagsModal, closeManageTagsModal] = useToggle(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const courseId = useSelector(getCourseId);
  const intl = useIntl();
  const xblockIFrameHtmlAndResources = useSelector(getXBlockIFrameHtmlAndResources);
  const xblockInstanceHtmlAndResources = find(xblockIFrameHtmlAndResources, { xblockId: id });
  const {
    canCopy, canDelete, canDuplicate, canManageAccess, canManageTags, canMove,
  } = actions;

  const [showLegacyEditModal, toggleLegacyEditModal] = useState(false);
  const xblockLegacyEditModalRef = useRef(null);

  useOverflowControl('.xblock-edit-modal');

  useEffect(() => {
    const handleMessage = (event) => {
      const { method } = event.data;

      if (method === 'close_edit_modal') {
        toggleLegacyEditModal(false);
        dispatch(fetchCourseVerticalChildrenData(blockId));
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [xblockLegacyEditModalRef]);
  const {
    data: contentTaxonomyTagsCount,
    isSuccess: isContentTaxonomyTagsCountLoaded,
  } = useContentTagsCount(id || '');

  const visibilityMessage = userPartitionInfo.selectedGroupsLabel
    ? intl.formatMessage(messages.visibilityMessage, { selectedGroupsLabel: userPartitionInfo.selectedGroupsLabel })
    : null;

  const stylesWithContent = xblockIFrameHtmlAndResources
    ?.map(item => extractStylesWithContent(item.html))
    .filter(styles => styles.length > 0);

  useEffect(() => {
    dispatch(fetchXBlockIFrameHtmlAndResourcesQuery(id));
  }, []);

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
      toggleLegacyEditModal(true);
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
    <>
      {showLegacyEditModal && createPortal(
        <div className="xblock-edit-modal">
          <iframe
            key="edit-modal"
            title="block"
            ref={xblockLegacyEditModalRef}
            src={`${getConfig().STUDIO_BASE_URL}/xblock/${id}/editor`}
            // allowing 'autoplay' is required to allow the video XBlock to control the YouTube iframe it has.
            allow={IFRAME_FEATURE_POLICY}
            referrerPolicy="origin"
            frameBorder={0}
            scrolling="no"
            sandbox={[
              'allow-forms',
              'allow-modals',
              'allow-popups',
              'allow-popups-to-escape-sandbox',
              'allow-presentation',
              'allow-same-origin', // This is only secure IF the IFrame source
              // is served from a completely different domain name
              // e.g. labxchange-xblocks.net vs www.labxchange.org
              'allow-scripts',
              'allow-top-navigation-by-user-activation',
            ].join(' ')}
          />
        </div>,
        document.body,
      )}
      <div ref={courseXBlockElementRef} {...props}>
        <Card
          as={SortableItem}
          isDraggable
          isDroppable
          id={id}
          category="xblock"
          componentStyle={{ marginBottom: 0 }}
        >
          <Card.Header
            title={title}
            subtitle={visibilityMessage}
            actions={(
              <ActionRow className="mr-2">
                {
                  canManageTags
                && isContentTaxonomyTagsCountLoaded
                  && contentTaxonomyTagsCount > 0
                  && <div className="ml-2"><TagCount count={contentTaxonomyTagsCount} onClick={openManageTagsModal} /></div>
                }
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
                  <Dropdown.Menu>{canDuplicate && (
                    <Dropdown.Item onClick={() => unitXBlockActions.handleDuplicate(id)}>
                      {intl.formatMessage(messages.blockLabelButtonDuplicate)}
                    </Dropdown.Item>
                  )}
                  {canManageTags && (
                    <Dropdown.Item onClick={openManageTagsModal}>
                      {intl.formatMessage(messages.blockLabelButtonManageTags)}
                    </Dropdown.Item>
                  )}
                    {canMove && (
                    <Dropdown.Item>
                      {intl.formatMessage(messages.blockLabelButtonMove)}
                    </Dropdown.Item>
                  )}
                  {canCopy && (
                    <Dropdown.Item onClick={() => dispatch(copyToClipboard(id))}>
                      {intl.formatMessage(messages.blockLabelButtonCopyToClipboard)}
                    </Dropdown.Item>
                  )}
                    {canManageAccess && (
                    <Dropdown.Item onClick={openConfigureModal}>
                      {intl.formatMessage(messages.blockLabelButtonManageAccess)}
                    </Dropdown.Item>
                  )}
                  {canDelete && (
                    <Dropdown.Item onClick={openDeleteModal}>
                      {intl.formatMessage(messages.blockLabelButtonDelete)}
                    </Dropdown.Item>
                  )}
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
                <Sheet
                  position="right"
                  show={isManageTagsOpen}
                  blocking={false}
                  variant="light"
                  onClose={closeManageTagsModal}
                >
                  <ContentTagsDrawer id={id} onClose={closeManageTagsModal} />
                </Sheet>
              </ActionRow>
            )}
          />
          <Card.Section>
            {renderError ? <RenderErrorAlert errorMessage={renderError} /> : (
              <>
                <XBlockMessages validationMessages={validationMessages} />
                {xblockInstanceHtmlAndResources && (
                  <XBlockContent
                    getHandlerUrl={getHandlerUrl}
                    view={xblockInstanceHtmlAndResources}
                    type={type}
                    stylesWithContent={stylesWithContent}
                  />
                )}
              </>
            )}
          </Card.Section>
        </Card>
      </div>
    </>
  );
};

CourseXBlock.defaultProps = {
  validationMessages: [],
  shouldScroll: false,
  renderError: undefined,
};

CourseXBlock.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  blockId: PropTypes.string.isRequired,
  renderError: PropTypes.string,
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
  actions: PropTypes.shape({
    canCopy: PropTypes.bool,
    canDelete: PropTypes.bool,
    canDuplicate: PropTypes.bool,
    canManageAccess: PropTypes.bool,
    canManageTags: PropTypes.bool,
    canMove: PropTypes.bool,
  }).isRequired,
};

export default CourseXBlock;

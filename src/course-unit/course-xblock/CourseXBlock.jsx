import {
  memo, useEffect, useRef, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  ActionRow, Card, Dropdown, Icon, IconButton, useToggle, Sheet, OverlayTrigger, Tooltip, Button,
} from '@openedx/paragon';
import {
  EditOutline as EditIcon,
  MoreVert as MoveVertIcon,
  ArrowDropDown as ArrowDownIcon,
  ArrowDropUp as ArrowUpIcon,
} from '@openedx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { find } from 'lodash';
import { getConfig } from '@edx/frontend-platform';
import classNames from 'classnames';

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
import { copyToClipboard } from '../../generic/data/thunks';
import { getHandlerUrl } from '../data/api';
import {
  fetchCourseUnitQuery,
  fetchCourseVerticalChildrenData,
  fetchXBlockIFrameHtmlAndResourcesQuery,
} from '../data/thunk';
import { COMPONENT_TYPES } from '../constants';
import XBlockMessages from './xblock-messages/XBlockMessages';
import RenderErrorAlert from './render-error-alert';
import { XBlockContent } from './xblock-content';
import messages from './messages';
import { extractStylesWithContent } from './utils';
import CourseIFrame from './CourseIFrame';

const XBLOCK_EDIT_MODAL_CLASS_NAME = 'xblock-edit-modal';

const CourseXBlock = memo(({
  id, title, type, unitXBlockActions, shouldScroll, userPartitionInfo,
  handleConfigureSubmit, validationMessages, renderError, actions, blockId,
  isXBlocksExpanded, isXBlocksRendered, ...props
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
  const xblockInstanceHtmlAndResources = useMemo(
    () => find(xblockIFrameHtmlAndResources, { xblockId: id }),
    [id, xblockIFrameHtmlAndResources],
  );
  const [showLegacyEditModal, toggleLegacyEditModal] = useState(false);
  const xblockLegacyEditModalRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(isXBlocksExpanded);
  const [isRendered, setIsRendered] = useState(isXBlocksRendered);

  useEffect(() => {
    setIsExpanded(isXBlocksExpanded);
    setIsRendered(isXBlocksRendered);
  }, [isXBlocksExpanded, isXBlocksRendered]);

  const {
    canCopy, canDelete, canDuplicate, canManageAccess, canManageTags, canMove,
  } = actions;

  useOverflowControl(`.${XBLOCK_EDIT_MODAL_CLASS_NAME}`);

  useEffect(() => {
    const handleMessage = (event) => {
      const { method } = event.data;

      if (method === 'close_edit_modal') {
        toggleLegacyEditModal(false);
        dispatch(fetchCourseVerticalChildrenData(blockId));
        dispatch(fetchXBlockIFrameHtmlAndResourcesQuery(id));
        dispatch(fetchCourseUnitQuery(blockId));
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

  const [searchParams] = useSearchParams();
  const locatorId = searchParams.get('show');
  const isScrolledToElement = locatorId === id;

  const visibilityMessage = userPartitionInfo.selectedGroupsLabel
    ? intl.formatMessage(messages.visibilityMessage, { selectedGroupsLabel: userPartitionInfo.selectedGroupsLabel })
    : null;

  const stylesWithContent = useMemo(
    () => xblockIFrameHtmlAndResources
      ?.map(item => extractStylesWithContent(item.html))
      .filter(styles => styles.length > 0),
    [],
  );

  useEffect(() => {
    dispatch(fetchXBlockIFrameHtmlAndResourcesQuery(id));
    localStorage.removeItem('editedXBlockId');
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
      localStorage.setItem('editedXBlockId', id);
    }
  };

  const onConfigureSubmit = (...arg) => {
    handleConfigureSubmit(id, ...arg, closeConfigureModal);
  };

  const handleExpandContent = () => {
    setIsRendered(true);
    setIsExpanded((prevState) => !prevState);
  };

  useEffect(() => {
    // if this item has been newly added, scroll to it.
    if (courseXBlockElementRef.current && (shouldScroll || isScrolledToElement)) {
      scrollToElement(courseXBlockElementRef.current);
    }
  }, [isScrolledToElement]);

  return (
    <>
      {showLegacyEditModal && (
        <div className={XBLOCK_EDIT_MODAL_CLASS_NAME}>
          <CourseIFrame
            title="xblock-edit-modal-iframe"
            key="xblock-edit-modal-key"
            ref={xblockLegacyEditModalRef}
            src={`${getConfig().STUDIO_BASE_URL}/xblock/${id}/editor`}
          />
        </div>
      )}
      <div
        id={id}
        ref={courseXBlockElementRef}
        {...props}
        className={classNames('course-unit__xblock', {
          'xblock-highlight': isScrolledToElement,
        })}
      >
        <Card
          as={SortableItem}
          id={id}
          draggable
          category="xblock"
          componentStyle={{ marginBottom: 0 }}
        >
          <Card.Header
            title={(
              <OverlayTrigger
                placement="bottom"
                overlay={(
                  <Tooltip id={`${title}-${intl.formatMessage(messages.expandTooltip)}`}>
                    {intl.formatMessage(messages.expandTooltip)}
                  </Tooltip>
                )}
              >
                <Button
                  iconBefore={isExpanded ? ArrowUpIcon : ArrowDownIcon}
                  variant="tertiary"
                  onClick={handleExpandContent}
                >
                  <span className="pgn__card-header-title-md">{title}</span>
                </Button>
              </OverlayTrigger>
            )}
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
                  <Dropdown.Menu>
                    {canDuplicate && (
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
          {isRendered
          && (
            <Card.Section className={classNames({ 'd-none': !isExpanded })}>
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
          )}
        </Card>
      </div>
    </>
  );
});

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
  isXBlocksExpanded: PropTypes.bool.isRequired,
  isXBlocksRendered: PropTypes.bool.isRequired,
};

export default CourseXBlock;

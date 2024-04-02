import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import {
  ActionRow, Card, Dropdown, Icon, IconButton, useToggle, Sheet,
} from '@openedx/paragon';
import { EditOutline as EditIcon, MoreVert as MoveVertIcon } from '@openedx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { find } from 'lodash';
import { getConfig } from '@edx/frontend-platform';

import ContentTagsDrawer from '../../content-tags-drawer/ContentTagsDrawer';
import { useContentTagsCount } from '../../generic/data/apiHooks';
import TagCount from '../../generic/tag-count';
import DeleteModal from '../../generic/delete-modal/DeleteModal';
import ConfigureModal from '../../generic/configure-modal/ConfigureModal';
import SortableItem from '../../generic/drag-helper/SortableItem';
import { scrollToElement } from '../../course-outline/utils';
import { COURSE_BLOCK_NAMES } from '../../constants';
import {
  getCanEdit,
  getCourseId,
  getXBlockIFrameHtmlAndResources,
} from '../data/selectors';
import { copyToClipboard } from '../../generic/data/thunks';
import { getHandlerUrl } from '../data/api';
import { fetchXBlockIFrameHtmlAndResourcesQuery } from '../data/thunk';
import { COMPONENT_TYPES } from '../constants';
import XBlockMessages from './xblock-messages/XBlockMessages';
import RenderErrorAlert from './render-error-alert';
import { XBlockContent } from './xblock-content';
import messages from './messages';
import { extractStylesWithContent } from './utils';

const CourseXBlock = ({
  id, title, type, unitXBlockActions, shouldScroll, userPartitionInfo,
  handleConfigureSubmit, validationMessages, renderError, ...props
}) => {
  const courseXBlockElementRef = useRef(null);
  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useToggle(false);
  const [isConfigureModalOpen, openConfigureModal, closeConfigureModal] = useToggle(false);
  const [isManageTagsOpen, openManageTagsModal, closeManageTagsModal] = useToggle(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const canEdit = useSelector(getCanEdit);
  const courseId = useSelector(getCourseId);
  const intl = useIntl();
  const xblockIFrameHtmlAndResources = useSelector(getXBlockIFrameHtmlAndResources);
  const xblockInstanceHtmlAndResources = find(xblockIFrameHtmlAndResources, { xblockId: id });

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
    }
  };

  const onConfigureSubmit = (...arg) => {
    handleConfigureSubmit(id, ...arg, closeConfigureModal);
  };

  useEffect(() => {
    // if this item has been newly added, scroll to it.
    if (courseXBlockElementRef.current && (shouldScroll || isScrolledToElement)) {
      scrollToElement(courseXBlockElementRef.current);
    }
  }, [isScrolledToElement]);

  return (
    <div
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
          title={title}
          subtitle={visibilityMessage}
          actions={(
            <ActionRow className="mr-2">
              {
                isContentTaxonomyTagsCountLoaded
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
                  <Dropdown.Item onClick={() => unitXBlockActions.handleDuplicate(id)}>
                    {intl.formatMessage(messages.blockLabelButtonDuplicate)}
                  </Dropdown.Item>
                  {getConfig().ENABLE_TAGGING_TAXONOMY_PAGES && (
                    <Dropdown.Item onClick={openManageTagsModal}>
                      {intl.formatMessage(messages.blockLabelButtonManageTags)}
                    </Dropdown.Item>
                  )}
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
};

export default CourseXBlock;

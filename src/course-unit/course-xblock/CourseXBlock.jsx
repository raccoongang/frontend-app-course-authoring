import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { getConfig } from '@edx/frontend-platform';
import {
  ActionRow, Card, Dropdown, Icon, IconButton, useToggle,
} from '@edx/paragon';
import { EditOutline as EditIcon, MoreVert as MoveVertIcon } from '@edx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import DeleteModal from '../../generic/delete-modal/DeleteModal';
import ConfigureModal from '../../generic/configure-modal/ConfigureModal';
import ConditionalSortableElement from '../../generic/drag-helper/ConditionalSortableElement';
import { scrollToElement } from '../../course-outline/utils';
import { COURSE_BLOCK_NAMES } from '../../constants';
import { getCanEdit, getCourseId } from '../data/selectors';
import { copyToClipboard, fetchXBlockModalQuery } from '../data/thunk';
import { COMPONENT_ICON_TYPES } from '../constants';
import XBlockContent from './xblock-content/XBlockContent';
import XBlockMessages from './xblock-messages/XBlockMessages';
import { getIFrameUrl } from './urls';
import messages from './messages';
import LibraryBlock from './libraries/library-authoring/edit-block/LibraryBlock/LibraryBlock';
import { getXBlockHandlerUrl, XBLOCK_VIEW_SYSTEM } from './libraries/library-authoring';

const getHandlerUrl = async (blockId) => getXBlockHandlerUrl(blockId, XBLOCK_VIEW_SYSTEM.Studio, 'handler_name');

const CourseXBlock = ({
  id, title, type, unitXBlockActions, shouldScroll, userPartitionInfo,
  handleConfigureSubmit, validationMessages, ...props
}) => {
  const courseXBlockElementRef = useRef(null);
  const iframeElementRef = useRef(null);
  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useToggle(false);
  const [isConfigureModalOpen, openConfigureModal, closeConfigureModal] = useToggle(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const courseId = useSelector(getCourseId);
  const canEdit = useSelector(getCanEdit);
  const intl = useIntl();
  const iframeUrl = getIFrameUrl({ blockId: id });
  const xblockModalData = useSelector(state => state.courseUnit.xblockModalData);
  const [isOpen, open, close] = useToggle(false);

  const visibilityMessage = userPartitionInfo.selectedGroupsLabel
    ? intl.formatMessage(messages.visibilityMessage, { selectedGroupsLabel: userPartitionInfo.selectedGroupsLabel })
    : null;

  useEffect(() => {
    window.addEventListener('message', async (event) => {
      console.log('DATA', event.data);
      const { method, replyKey, ...args } = event.data;

      if (method === 'remove') {
        console.log('CLOSE');
        close();
      }
    });
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
    open();
    switch (type) {
    case COMPONENT_ICON_TYPES.html:
    case COMPONENT_ICON_TYPES.problem:
    case COMPONENT_ICON_TYPES.video:
      navigate(`/course/${courseId}/editor/${type}/${id}`);
      break;
    default:
      dispatch(fetchXBlockModalQuery(id));
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
      {Object.keys(xblockModalData).length && isOpen ? (
        <LibraryBlock getHandlerUrl={getHandlerUrl} view={xblockModalData} displayName={title} />
      ) : null}
      <div ref={courseXBlockElementRef} {...props}>
        <div
          className="TEST_IFRAME_WRAPPER d-none"
          style={{
            height: '400px',
            boxSizing: 'content-box',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '200px',
            margin: '24px',
          }}
        >
          <iframe
            key={1}
            ref={iframeElementRef}
            src={getConfig().SECURE_ORIGIN_XBLOCK_BOOTSTRAP_HTML_URL}
            title="block"
            frameBorder="0"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              minHeight: '200px',
              border: '0 none',
              backgroundColor: 'white',
            }}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
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
        </div>
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
            <XBlockMessages validationMessages={validationMessages} />
            <XBlockContent id={id} title={title} elementId={id} iframeUrl={iframeUrl} />
          </Card.Section>
        </Card>
      </div>
    </>
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

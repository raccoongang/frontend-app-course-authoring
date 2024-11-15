import {
  useRef, FC, useEffect, useState,
} from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import { useToggle } from '@openedx/paragon';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import DeleteModal from '../../generic/delete-modal/DeleteModal';
import ConfigureModal from '../../generic/configure-modal/ConfigureModal';
import { copyToClipboard } from '../../generic/data/thunks';
import { COURSE_BLOCK_NAMES, IFRAME_FEATURE_POLICY, NOTIFICATION_MESSAGES } from '../../constants';
import { messageTypes } from '../constants';
import { useIframe } from '../context/hooks';
import { useIFrameBehavior } from './hooks';
import messages from './messages';
import {
  hideProcessingNotification,
  showProcessingNotification,
} from '../../generic/processing-notification/data/slice';

interface XBlockContainerIframeProps {
  courseId: string;
  blockId: string;
  unitXBlockActions: {
    handleDelete: () => void;
    handleDuplicate: () => void;
  };
  xblocks: Array<{
    name: string;
    blockId: string;
    blockType: string;
    userPartitionInfo: {
      selectablePartitions: any[];
      selectedPartitionIndex: number;
      selectedGroupsLabel: string;
    };
    userPartitions: Array<{
      id: number;
      name: string;
      scheme: string;
      groups: Array<{
        id: number;
        name: string;
        selected: boolean;
        deleted: boolean;
      }>;
    }>;
    upstreamLink: string | null;
    actions: {
      canCopy: boolean;
      canDuplicate: boolean;
      canMove: boolean;
      canManageAccess: boolean;
      canDelete: boolean;
      canManageTags: boolean;
    };
    validationMessages: any[];
    renderError: string;
    id: string;
  }>;
  handleConfigureSubmit: (XBlockId: string, ...args: any[]) => void;
  handleXBlockDragAndDrop: () => void;
}

const XBlockContainerIframe: FC<XBlockContainerIframeProps> = ({
  courseId, blockId, unitXBlockActions, xblocks, handleConfigureSubmit, handleXBlockDragAndDrop,
}) => {
  const intl = useIntl();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useToggle(false);
  const [isConfigureModalOpen, openConfigureModal, closeConfigureModal] = useToggle(false);
  const { setIframeRef, sendMessageToIframe } = useIframe();
  const [editXblockId, setEditXblockId] = useState<string | null>(null);
  const [currentXblockData, setCurrentXblockData] = useState<any>({});

  const iframeUrl = `${getConfig().STUDIO_BASE_URL}/container_embed/${blockId}`;
  const { iframeHeight } = useIFrameBehavior({ id: blockId, iframeUrl });

  useEffect(() => {
    setIframeRef(iframeRef);
  }, [setIframeRef]);

  const handleConfigure = (id: string) => {
    openConfigureModal();
    setEditXblockId(id);

    const foundXBlockInfo = xblocks?.find(block => block.blockId === id);

    if (foundXBlockInfo) {
      const { name, userPartitionInfo } = foundXBlockInfo;

      setCurrentXblockData({
        category: COURSE_BLOCK_NAMES.component.id,
        displayName: name,
        userPartitionInfo,
        showCorrectness: 'always',
      });
    }
  };

  const handleDuplicateXBlock = () => {
    unitXBlockActions.handleDuplicate();
    dispatch(showProcessingNotification(NOTIFICATION_MESSAGES.duplicating));
  };

  const handleFinishDuplicateXBlock = () => {
    unitXBlockActions.handleDuplicate();
    requestAnimationFrame(() => {
      dispatch(hideProcessingNotification());
    });
  };

  const handleDeleteItemSubmit = () => {
    unitXBlockActions.handleDelete();
    closeDeleteModal();
    sendMessageToIframe('confirmDeleteXBlock', null);
  };

  const onConfigureSubmit = (...args: any[]) => {
    if (editXblockId) {
      handleConfigureSubmit(editXblockId, ...args, closeConfigureModal);
      // TODO: this artificial delay is a temporary solution
      // to ensure the iframe content is properly refreshed.
      setTimeout(() => {
        sendMessageToIframe(messageTypes.refreshXBlock, null);
      }, 1000);
    }
  };

  useEffect(() => {
    const messageHandlers: Record<string, (payload) => void> = {
      [messageTypes.startDeleteXBlock]: () => openDeleteModal(),
      [messageTypes.finishDeleteXBlock]: () => dispatch(hideProcessingNotification()),
      [messageTypes.manageXBlockAccess]: (payload) => handleConfigure(payload.id),
      [messageTypes.copyXBlock]: (payload) => dispatch(copyToClipboard(payload.id)),
      [messageTypes.startDuplicateXBlock]: () => handleDuplicateXBlock(),
      [messageTypes.finishDuplicateXBlock]: () => handleFinishDuplicateXBlock(),
      [messageTypes.refreshPositions]: () => handleXBlockDragAndDrop(),
      [messageTypes.newXBlockEditor]: (payload) => navigate(`/course/${courseId}/editor${payload.url}`),
    };

    const handleMessage = (event: MessageEvent) => {
      const { type, payload } = event.data || {};

      if (type && messageHandlers[type]) {
        messageHandlers[type](payload);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [dispatch, blockId, xblocks]);

  return (
    <>
      <DeleteModal
        category="component"
        isOpen={isDeleteModalOpen}
        close={closeDeleteModal}
        onDeleteSubmit={handleDeleteItemSubmit}
      />
      <ConfigureModal
        isXBlockComponent
        isOpen={isConfigureModalOpen}
        onClose={closeConfigureModal}
        onConfigureSubmit={onConfigureSubmit}
        currentItemData={currentXblockData}
        isSelfPaced={false}
      />
      <iframe
        ref={iframeRef}
        title={intl.formatMessage(messages.xblockIframeTitle)}
        src={iframeUrl}
        frameBorder="0"
        allow={IFRAME_FEATURE_POLICY}
        allowFullScreen
        loading="lazy"
        style={{
          width: '100%',
          height: iframeHeight,
          // height: iframeHeight,
        }}
        scrolling="no"
        referrerPolicy="origin"
        aria-label={intl.formatMessage(messages.xblockIframeLabel, { xblockCount: xblocks.length })}
      />
    </>
  );
};

export default XBlockContainerIframe;

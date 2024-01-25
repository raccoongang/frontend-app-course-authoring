import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getClipboardData } from '../data/selectors';
import { NOT_XBLOCK_TYPES, STUDIO_CLIPBOARD_CHANNEL } from '../constants';

const useCopyToClipboard = (canEdit = true) => {
  const [clipboardBroadcastChannel] = useState(() => new BroadcastChannel(STUDIO_CLIPBOARD_CHANNEL));
  const [showPasteUnit, setShowPasteUnit] = useState(false);
  const [showPasteXBlock, setShowPasteXBlock] = useState(false);
  const clipboardData = useSelector(getClipboardData);

  // Function to refresh the paste button's visibility
  const refreshPasteButton = (data) => {
    const isPasteable = canEdit && data?.content && data.content.status !== 'expired';
    const isPasteableXBlock = isPasteable && !NOT_XBLOCK_TYPES.includes(data.content.blockType);
    const isPasteableUnit = isPasteable && data.content.blockType === 'vertical';

    setShowPasteXBlock(!!isPasteableXBlock);
    setShowPasteUnit(!!isPasteableUnit);
  };

  useEffect(() => {
    // Handle updates to clipboard data
    if (canEdit) {
      refreshPasteButton(clipboardData);
      clipboardBroadcastChannel.postMessage(clipboardData);
    } else {
      setShowPasteXBlock(false);
      setShowPasteUnit(false);
    }
  }, [clipboardData, canEdit, clipboardBroadcastChannel]);

  useEffect(() => {
    // Handle messages from the broadcast channel
    clipboardBroadcastChannel.onmessage = (event) => {
      refreshPasteButton(event.data);
    };

    // Cleanup function for the BroadcastChannel when the hook is unmounted
    return () => {
      clipboardBroadcastChannel.close();
    };
  }, [clipboardBroadcastChannel]);

  return { showPasteUnit, showPasteXBlock };
};

export default useCopyToClipboard;

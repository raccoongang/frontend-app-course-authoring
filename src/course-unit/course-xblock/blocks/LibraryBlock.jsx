import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ensureConfig, getConfig } from '@edx/frontend-platform';
import wrapBlockHtmlForIFrame from '../libraries/library-authoring/edit-block/LibraryBlock/wrap';
import { fetchable } from '../libraries/library-authoring';
import { blockViewShape } from '../libraries/library-authoring/edit-block/data/shapes';

ensureConfig(['LMS_BASE_URL', 'SECURE_ORIGIN_XBLOCK_BOOTSTRAP_HTML_URL'], 'library block component');

const LibraryBlock = ({ getHandlerUrl, onBlockNotification, view }) => {
  const iframeRef = useRef(null);
  const [html, setHtml] = useState(null);
  const [iFrameHeight, setIFrameHeight] = useState(400);
  const [iframeKey, setIframeKey] = useState(0);

  const receivedWindowMessage = async (event) => {
    if (iframeRef.current === null || event.source !== iframeRef.current.contentWindow) {
      return;
    }

    const { method, replyKey, ...args } = event.data;
    const frame = iframeRef.current.contentWindow;

    const sendReply = async (data) => {
      frame.postMessage({ ...data, replyKey }, '*');
    };

    if (method === 'bootstrap') {
      await sendReply({ initialHtml: html });
    } else if (method === 'get_handler_url') {
      const handlerUrl = await getHandlerUrl(args.usageId);
      await sendReply({ handlerUrl });
    } else if (method === 'update_frame_height') {
      setIFrameHeight(args.height);
    } else if (method?.indexOf('xblock:') === 0) {
      if (onBlockNotification) {
        onBlockNotification({
          eventType: method.substr(7),
          ...args,
        });
      }
    }
  };

  const processView = () => {
    if (view.value) {
      const newHtml = wrapBlockHtmlForIFrame(
        view.value.content,
        view.value.resources,
        getConfig().LMS_BASE_URL,
      );

      setHtml(newHtml);
      setIframeKey((prevKey) => prevKey + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('message', receivedWindowMessage);
    return () => {
      window.removeEventListener('message', receivedWindowMessage);
    };
  }, []);

  useEffect(() => {
    processView();
  }, [view]);

  if (html === null) {
    return null;
  }

  return (
    <div
      className="TEST_IFRAME_WRAPPER"
      style={{
        height: `${iFrameHeight}px`,
        boxSizing: 'content-box',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '200px',
        margin: '24px',
      }}
    >
      <iframe
        key={iframeKey}
        ref={iframeRef}
        title="block"
        src={getConfig().SECURE_ORIGIN_XBLOCK_BOOTSTRAP_HTML_URL}
        data-testid="block-preview"
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
          'allow-same-origin',
          'allow-scripts',
          'allow-top-navigation-by-user-activation',
        ].join(' ')}
      />
    </div>
  );
};

LibraryBlock.propTypes = {
  getHandlerUrl: PropTypes.func.isRequired,
  onBlockNotification: PropTypes.func,
  view: fetchable(blockViewShape).isRequired,
};

LibraryBlock.defaultProps = {
  onBlockNotification: null,
};

export default LibraryBlock;

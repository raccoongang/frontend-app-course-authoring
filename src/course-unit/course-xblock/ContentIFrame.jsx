import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';

import { LoadingSpinner } from '../../generic/Loading';
import AlertMessage from '../../generic/alert-message';
import { IFRAME_FEATURE_POLICY } from './constants';
import { useIFrameBehavior } from './hooks';
import messages from './messages';

const ContentIFrame = ({
  id,
  iframeUrl,
  elementId,
  onLoaded,
  title,
}) => {
  const intl = useIntl();
  const {
    iframeHeight,
    handleIFrameLoad,
    showError,
    hasLoaded,
  } = useIFrameBehavior({
    elementId, id, iframeUrl, onLoaded,
  });

  const contentIFrameProps = {
    id: elementId,
    src: iframeUrl,
    allow: IFRAME_FEATURE_POLICY,
    frameBorder: 0,
    allowFullScreen: true,
    height: iframeHeight,
    scrolling: 'no',
    referrerPolicy: 'origin',
    'data-testid': 'content-iframe-test-id',
    onLoad: handleIFrameLoad,
  };

  return (
    <div className="unit-iframe-wrapper">
      {!hasLoaded && (
        showError ? (
          <AlertMessage variant="danger" description={intl.formatMessage(messages.iframeErrorText)} />
        ) : (
          <div className="d-flex justify-content-center align-items-center flex-column">
            <LoadingSpinner />
          </div>
        )
      )}
      <iframe title={title} className="w-100" {...contentIFrameProps} />
    </div>
  );
};

ContentIFrame.propTypes = {
  iframeUrl: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  elementId: PropTypes.string.isRequired,
  onLoaded: PropTypes.func,
  title: PropTypes.node.isRequired,
};

ContentIFrame.defaultProps = {
  onLoaded: () => {},
};

export default ContentIFrame;

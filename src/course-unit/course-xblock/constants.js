import PropTypes from 'prop-types';

export const MESSAGE_TYPES = {
  modal: 'plugin.modal',
  resize: 'plugin.resize',
  videoFullScreen: 'plugin.videoFullScreen',
};

export const IFRAME_FEATURE_POLICY = (
  'microphone *; camera *; midi *; geolocation *; encrypted-media *, clipboard-write *'
);

export const MESSAGE_ERROR_TYPES = {
  error: 'error',
  warning: 'warning',
};

export const IFRAME_LOADING_STATUS = {
  STANDBY: 'standby', // Structure has been created but is not yet loading.
  LOADING: 'loading',
  LOADED: 'loaded',
  FAILED: 'failed',
};

export const statusShape = PropTypes.oneOf(Object.values(IFRAME_LOADING_STATUS));

export const fetchable = (valueShape) => PropTypes.shape({
  status: statusShape,
  value: valueShape,
});

export const blockViewShape = PropTypes.shape({
  content: PropTypes.string.isRequired,
  resources: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
});

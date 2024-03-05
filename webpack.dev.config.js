const path = require('path');
const { createConfig } = require('@openedx/frontend-build');
const CopyPlugin = require('copy-webpack-plugin');

const config = createConfig('webpack-dev', {
  resolve: {
    alias: {
      // Plugins can use 'CourseAuthoring' as an import alias for this app:
      CourseAuthoring: path.resolve(__dirname, 'src/'),
    },
    fallback: {
      fs: false,
      constants: false,
    },
  },
});

/**
 * Allow serving xblock-bootstrap.html from the MFE itself.
 */
config.plugins.push(
  new CopyPlugin({
    patterns: [{
      context: path.resolve(__dirname, 'src/course-unit/course-xblock/library-authoring/edit-block/LibraryBlock'),
      from: 'xblock-bootstrap.html',
    }],
  }),
);

module.exports = config;

const {
    default: FluentUIReactIconsFontSubsettingPlugin,
  } = require('@fluentui/react-icons-font-subsetting-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  devtool: 'source-map',
  module: {
    rules: [
      // Treat the font files as webpack assets
      {
        test: /\.(ttf|woff2?)$/,
        type: 'asset',
      },
    ],
  },
  resolve: {
    // Include 'fluentIconFont' to use the font implementation of the Fluent icons
    conditionNames: ['fluentIconFont', 'import'],
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    // Include this plugin
    new FluentUIReactIconsFontSubsettingPlugin(),
  ],
};
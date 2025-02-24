// const {
//     default: FluentUIReactIconsFontSubsettingPlugin,
//   } = require('@fluentui/react-icons-font-subsetting-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');
const path = require('path');

module.exports = {
  externals: {
    '@fluentui/react-icons/lib': '@fluentui/react-icons/lib',
  },
  resolve: {
    alias: {
      '@fluentui/react-icons': path.resolve(__dirname, 'src/empty-module.js')
    }
  },
  // devtool: 'source-map',
  // module: {
  //   rules: [
  //     // Treat the font files as webpack assets
  //     {
  //       test: /\.(ttf|woff2?)$/,
  //       type: 'asset',
  //     },
  //   ],
  // },
  // resolve: {
  //   // Include 'fluentIconFont' to use the font implementation of the Fluent icons
  //   conditionNames: ['fluentIconFont', 'import'],
  // },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /@fluentui\/react-icons\/lib/,
    }),
    // new BundleAnalyzerPlugin({ analyzerMode: "server", analyzerPort: 8088, analyzerHost: "127.0.0.2" }),
  ],
};
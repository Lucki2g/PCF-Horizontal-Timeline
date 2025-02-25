
const Visualizer = require('webpack-visualizer-plugin2');
const path = require("path")

module.exports = {
  devtool: 'source-map',
  module: {
      rules: [
          // Treat the font files as webpack assets
          {
              test: /\.(ttf|woff2?)$/,
              type: 'asset',
          }
      ]
  },
  resolve: {
    conditionNames: ['fluentIconFont', 'require', 'node'],
  },
  plugins: [
    //   new Visualizer(
    //     {
    //         filename: path.join('..', 'stats', 'statistics.html'),
    //         throwOnError: true,
    //     },
    //     {
    //         chunkModules: true
    //     })
  ]
};
const path = require('path');

module.exports = {
  mode: "production",
  optimization: {
    usedExports: true
  },
  entry: {
    'vs_utils': path.resolve(__dirname, 'src/utils/index.ts'),
  },
  // devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'ts-loader',
          options: {
            configFile: 'src/tsconfig.esm.json'
          }
        }],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.ts' ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
};

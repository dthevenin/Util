const path = require('path');

module.exports = {
  mode: "production",
  entry: './src/utils/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'ts-loader',
          options: {
            configFile: 'src/tsconfig.json'
          }
        }],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'vs_utils.js',
    path: path.resolve(__dirname, 'dist'),
  },
};

const path = require('path');
const CopyWebpackPlugin = require('webpack-copy-plugin');

const copyWebpackPlugin = new CopyWebpackPlugin({
    dirs: [{ from: './examples', to: './aframe-navigation/examples/'}]
});

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'aframe-navigation.js'
  },

  devServer: {
    contentBase: path.join(__dirname, "/"),
    compress: true,
    port: 7000,
    hot: true
  },

  plugins: [
      copyWebpackPlugin
  ],

    node: {
        fs: 'empty'
    }
};
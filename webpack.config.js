const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    background: './src/background.ts',
    content: './src/content.ts',
    popup: './src/popup/popup.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'], // 使用 MiniCssExtractPlugin.loader
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/popup/popup.html',
      filename: 'popup.html',
      chunks: ['popup'], // 僅包含 popup.js
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css', // 生成的 CSS 文件名
    }),
  ],
  mode: 'development',
  devtool: 'cheap-module-source-map',
};

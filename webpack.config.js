const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
  entry: "./src/js/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "./js/bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-proposal-object-rest-spread"],
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                autoprefixer,
              ],
            },
          },
          'sass-loader',
        ],
      },
      { 
        test: /\.pug$/,
        use: ['pug-loader']
      }
    ],
  },
  devServer: {
    clientLogLevel: 'info', // 'silent' | 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'none' | 'warning'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/views/pages/index.pug',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    }),
    new MiniCssExtractPlugin({
        filename: './css/styles.css',
      }),
  ],
};

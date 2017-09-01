const { resolve } = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const base = {
  context: resolve(__projroot), // __projroot is project root
  entry: {
    app: './src/index',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: resolve(__projroot, 'src'),
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            ['env', { targets: { browsers: 'ie >= 9' }, modules: false }],
            'stage-2',
            'react',
          ],
        },
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,  // WOFF Font
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff',
          },
        },
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, // WOFF2 Font
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff',
          },
        },
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, // TTF Font
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/octet-stream',
          },
        },
      },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: 'file-loader' }, // EOT Font
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,  // SVG Font
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'image/svg+xml',
          },
        },
      },
      { test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/, use: 'url-loader' }, // Common Image Formats
    ],
  },
  output: {
    path: resolve(__projroot, 'dist'),
    filename: '[name].js',
  },
  plugins: [],
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  stats: {
    colors: true,
  },
  target: 'web',
};


exports.build = merge(base, {
  bail: true,
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: false,
                importLoaders: 2,
                minimize: true,
                sourceMap: true,
              },
            },
          ],
          fallback: 'style-loader',
        }),
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      '__isDev__': JSON.stringify(false),
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      logLevel: 'error',
    }),
    new CleanWebpackPlugin(['dist']),
    new ExtractTextPlugin('style.css'),
    new HtmlWebpackPlugin({
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      isProd: true,
    }),
    new MinifyPlugin(),
  ],
});

exports.server = merge(base, {
  devServer: {
    publicPath: '/',
    compress: true,
    https: false,
    port: 9000,
    stats: {
      colors: true,
    },
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'css-loader',
      },
    ],
  },
  output: {
    publicPath: '/',
  },
  plugins: [
    new webpack.DefinePlugin({
      '__isDev__': JSON.stringify(true),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin(),
  ],
});

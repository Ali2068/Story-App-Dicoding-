const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/scripts/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.bundle.js',
    clean: true,
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' },
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext][query]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/public/icons', to: 'icons' },
        { from: 'src/public/images', to: 'images' },
        { from: 'src/public/manifest.json', to: 'manifest.json' },
        { from: 'src/public/offline.html', to: 'offline.html' },
        { from: 'src/public/images/placeholder.png', to: 'images/placeholder.png' },
        { from: 'src/scripts/sw-custom.js', to: 'sw-custom.js' }, // untuk importScripts
      ],
    }),
    new WorkboxWebpackPlugin.GenerateSW({
      swDest: 'sw.bundle.js',
      clientsClaim: true,
      skipWaiting: true,
      importScripts: ['sw-custom.js'],
      cleanupOutdatedCaches: true,
      navigateFallback: '/index.html',
      runtimeCaching: [
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 60,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: /^https:\/\/story-api\.dicoding\.dev\/v1\/stories/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'stories-api',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 24 * 60 * 60, // 1 hari
            },
          },
        },
        {
          urlPattern: ({ request }) => request.mode === 'navigate',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'pages',
            networkTimeoutSeconds: 10,
          },
        },
      ],
    }),
  ],
};

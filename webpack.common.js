// const ImageminPlugin = require("imagemin-webpack-plugin").default;
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const path = require('path');

module.exports = {
  entry: {
    main: './client/src/index.js',
    // vendor: "./src/vendor.js"
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
        test: /\.vue$/,
        use: ['vue-loader'],
      },
      // {
      //   test: /\.(png|jpe?g|svg|gif)$/,
      //   use: {
      //     loader: "file-loader",
      //     options: {
      //       name: "[name].[ext]",
      //       outputPath: "asd",
      //       esModule: false
      //     }
      //   }
      // }
    ],
  },
  resolve: {
    alias: {
      Components: path.resolve(__dirname, 'client/src/components'),
      Mixins: path.resolve(__dirname, 'client/src/mixins'),
      Services: path.resolve(__dirname, 'client/src/services'),
      Utils: path.resolve(__dirname, 'client/src/utils'),
      Classes: path.resolve(__dirname, 'client/src/classes'),
      Views: path.resolve(__dirname, 'client/src/views'),
    },
  },
  plugins: [
    new VueLoaderPlugin(),
    // new ImageminPlugin({
    //   test: /\.(jpe?g|png|svg|gif)$/,
    //   optipng: {
    //     optimizationLevel: 15
    //   }
    // })
  ],
};

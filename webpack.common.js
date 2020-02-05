// const ImageminPlugin = require("imagemin-webpack-plugin").default;
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
  entry: {
    main: "./client/src/index.js"
    // vendor: "./src/vendor.js"
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ["html-loader"]
      },
      {
        test: /\.vue$/,
        use: ["vue-loader"]
      }
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
    ]
  },
  plugins: [
    new VueLoaderPlugin()
    // new ImageminPlugin({
    //   test: /\.(jpe?g|png|svg|gif)$/,
    //   optipng: {
    //     optimizationLevel: 15
    //   }
    // })
  ]
};

const path = require("path");
const common = require("./webpack.common");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
  mode: "development",
  output: {
    filename: "[name]-[hash].js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin({ template: "./client/src/index.html" })],
  devServer: {
    hot: true,
    port: 8000,
    proxy: {
      "/api": "http://localhost:3000"
    },
    historyApiFallback: {
      rewrites: [
        {
          from: /.*/,
          to: path.posix.join("dist", "index.html")
        }
      ]
    }
  }
});

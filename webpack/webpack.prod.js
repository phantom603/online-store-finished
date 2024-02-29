const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
  output: {
    publicPath: "/",
    path: path.resolve(__dirname, "../build"),
    filename: "[name].[contenthash].js",
    clean: true,
  },
});

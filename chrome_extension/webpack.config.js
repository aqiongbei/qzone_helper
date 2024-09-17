const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  mode: "production",
  entry: ["./src/content/inject.js", "./src/content/inject.css"],
  output: {
    filename: "content/inject.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
      cleanStaleWebpackAssets: true,
    }),
    new MiniCssExtractPlugin({
      filename: "content/inject.css",
    }),
    // 复制静态文件
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./src",
          globOptions: {
            ignore: ["**/content"],
          },
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  optimization: {
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
  },
};

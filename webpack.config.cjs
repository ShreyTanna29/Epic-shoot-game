const path = require("path");

module.exports = {
  entry: "./src/script.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public"),
  },
  devServer: {
    static: "./public",
    hot: true,
    open: true,
    port: 3000,
  },
  mode: "production",
};

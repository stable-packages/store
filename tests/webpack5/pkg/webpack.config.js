// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");

module.exports = {
  mode: 'production',
  entry: "./src/index.ts",
  externals: {
    'global-store': 'GlobalStore'
  },
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"]
      }
    ]
  },
  optimization: {
    minimize: false
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", "..."]
  }
};

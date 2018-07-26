const webpack = require("webpack");

module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "url-loader"
      }
    ]
  },
  plugins: [new webpack.EnvironmentPlugin(["NODE_ENV"])]
};

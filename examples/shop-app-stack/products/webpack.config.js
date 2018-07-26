const webpack = require("webpack");

module.exports = {
  module: {
    rules: [
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: "graphql-tag/loader"
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "url-loader"
      }
    ]
  },
  plugins: [new webpack.EnvironmentPlugin(["NODE_ENV"])]
};

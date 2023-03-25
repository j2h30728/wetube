const path = require("path");
const MiniCssExtraPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    main: "./src/client/js/main.js",
    videoPlayer: "./src/client/js/videoPlayer.js",
    recorder: "./src/client/js/recorder.js",
  },
  mode: "development",
  plugins: [new MiniCssExtraPlugin({ filename: "css/styles.css" })],
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtraPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  watch: true,
};
// watchOptions: {
//   ignored: /node_modules/,
//   aggregateTimeout: 5000,
//   poll: 1000,
// },

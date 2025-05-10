const path = require("path");

module.exports = {
  entry: "./src/background.js", // Replace with your main file
  output: {
    filename: "background.bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "production", // Use "development" for debugging
  resolve: {
    extensions: [".js"],
  },
  target: "web", // Ensures compatibility with browser
};

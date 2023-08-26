const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true,
  resolver: {
    sourceExts: ["js", "ts", "tsx", "svg"],
  },
});

module.exports = config;

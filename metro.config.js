module.exports = {
  resolver: {
    extraNodeModules: {},
  },
  transformer: {
    assetPlugins: ['expo-asset/tools/hashAssetFiles'],
    getTransformOptions: async () => ({
      transform: {
        inlineRequires: true,
      },
    }),
  },
};

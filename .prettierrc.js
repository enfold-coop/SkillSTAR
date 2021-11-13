module.exports = {
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  jsxSingleQuote: true,
  bracketSpacing: true,
  bracketSameLine: false,
  proseWrap: 'always',
  overrides: [
    {
      files: ['*.json'],
      options: {
        tabWidth: 4,
      },
    },
  ],
};

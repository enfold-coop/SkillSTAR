module.exports = {
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  jsxSingleQuote: true,
  bracketSpacing: true,
  jsxBracketSameLine: false,
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

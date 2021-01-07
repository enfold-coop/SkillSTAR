module.exports = {
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  overrides: [
    {
      files: '*.json',
      options: {
        tabWidth: 4,
      },
    },
  ],
};

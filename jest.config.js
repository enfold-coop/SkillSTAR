module.exports = {
    preset: 'jest-expo',
    collectCoverage: true,
    collectCoverageFrom: [
        "**/*.{ts,tsx}",
        "!**/coverage/**",
        "!**/node_modules/**",
        "!**/babel.config.ts",
        "!**/jest.setup.ts"
    ],
};

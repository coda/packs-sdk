const samplesConfig = require('../documentation/samples/.eslintrc.js');

module.exports = {
  // Extend the config used by the sample code.
  ...samplesConfig,
  ignorePatterns: [
    // Skip the generated sample page, since they have already been linted.
    'samples/**/*.md',
  ],
  overrides: [
    {
      // Extend the config used by the sample code.
      ...samplesConfig.overrides[0],
      files: ['**/*.md'],
      excludedFiles: [
        // Don't apply the sample code style guide to the certain dev guides.
        'guides/development/testing.md',
        'guides/development/libraries.md',
      ],
    },
    {
      files: ['**/*.md'],
      rules: {
        // Markdown files use a different naming convention.
        'filenames/match-regex': 'off',
        // Code snippets rarely define variables without using them.
        '@typescript-eslint/no-unused-vars': 'off',
        // OK to log to the console.
        'no-console': 'off',
        // Allow trivial arrow functions in top-level code.
        '@getify/proper-arrows/where': ['error', {'global': false}],
      },
    }
  ],
  parserOptions: {
    extraFileExtensions: ['.md'],
  },
};

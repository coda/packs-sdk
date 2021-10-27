module.exports = {
  plugins: [
    'prefer-let',
    '@getify/proper-arrows',
  ],
  overrides: [
    {
      files: ['examples/**/*.ts', 'snippets/**/*.ts'],
      rules: {
        'object-shorthand': ['error', 'never'],
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            varsIgnorePattern: 'response|datasourceUrl|MySchema',
            argsIgnorePattern: 'context|param',
          },
        ],
        'max-len': ['error', {code: 80}],
        quotes: ['error', 'double'],
        'prefer-const': 'off',
        'prefer-let/prefer-let': 2,
        'prefer-template': 'off',
        '@typescript-eslint/restrict-plus-operands': 0,
        'func-style': ['error', 'declaration'],
        '@getify/proper-arrows/where': 'error',
      },
    },
  ],
};

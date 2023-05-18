module.exports = {
  plugins: [
    'prefer-let',
    '@getify/proper-arrows',
  ],
  overrides: [
    {
      files: ['**/*.ts'],
      rules: {
        'object-shorthand': ['error', 'never'],
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            varsIgnorePattern: 'response|datasetUrl|MySchema|snippet|data|parameters|row',
            argsIgnorePattern: 'context|param|parameters',
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
        'prefer-arrow-callback': 'off',
        'object-curly-spacing': ['error', 'always'],
        'comma-dangle': ['error', 'always-multiline'],
        'semi': ['error', 'always',],
        'one-var': 'off',
      },
    },
  ],
};

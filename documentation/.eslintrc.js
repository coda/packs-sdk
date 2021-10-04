module.exports = {
  plugins: [
    'prefer-let',
  ],
  overrides: [
    {
      files: ['examples/**/*.ts', 'snippets/**/*.ts'],
      rules: {
        'object-shorthand': ['error', 'never'],
        '@typescript-eslint/no-unused-vars': ['error', {
          varsIgnorePattern: 'response|datasourceUrl|MySchema', 
          argsIgnorePattern: 'context|param'
        },],
        'max-len': ['error', { 'code': 80 }],
        'quotes': ['error', 'double'],
        'prefer-const': 'off',
        'prefer-let/prefer-let': 2,
        'prefer-template': 'off',
      },
    },
  ],
};

module.exports = {
  noInlineConfig: false,
  overrides: [
    {
      files: ['snippets/**/*.ts'],
      rules: {
        'object-shorthand': ['error', 'never'],
        '@typescript-eslint/no-unused-vars': ['error', {
          varsIgnorePattern: 'response|datasourceUrl|MySchema', 
          argsIgnorePattern: 'context|param'
        },],
        'max-len': ['error', { 'code': 80 }],
        'quotes': ['error', 'double'],
        'prefer-const': 'off',
        'prefer-template': 'off',
      },
    },
    // TODO: Merge with above once the code in /examples is updated.
    {
      files: ['examples/**/*.ts'],
      rules: {
        'object-shorthand': 'off',
        '@typescript-eslint/no-unused-vars': ['error', {
          varsIgnorePattern: 'response', 
          argsIgnorePattern: 'myParam|context'
        },],
      }
    }
  ]
};

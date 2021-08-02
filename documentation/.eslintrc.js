module.exports = {
  rules: {
    'object-shorthand': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {varsIgnorePattern: 'response', argsIgnorePattern: 'myParam|context'},
    ],
  },
};

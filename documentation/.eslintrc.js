module.exports = {
  extends: ['../dev/eslint/rules/base_rules.js'],
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    mocha: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['ban', 'filenames', 'local', '@typescript-eslint'],
  settings: {},
  rules: {
    '@typescript-eslint/restrict-plus-operands': 'error',
    'object-shorthand': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {varsIgnorePattern: 'response', argsIgnorePattern: 'myParam|context'},
    ],
  },
};

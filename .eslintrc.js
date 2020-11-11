module.exports = {
  root: true,
  extends: ['./dev/eslint/rules/base_rules.js'],
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    mocha: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    sourceType: 'module',
  },
  plugins: ['ban', 'filenames', '@typescript-eslint'],
  settings: {},
  rules: {
    '@typescript-eslint/restrict-plus-operands': 'error',

    // TODO(jonathan): Figure out if we ever want to enable this and use exemptions.
    // camelcase: ['error', {ignoreDestructuring: true, allow: ['drive_v?', 'auth_session', 'utm_.*']}],
    camelcase: 'off',
  },
  overrides: [
    {
      files: ['**/*_test.{ts,tsx}'],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
    {
      files: ['**/*.d.ts'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        camelcase: 'off',
      },
    },
  ],
};

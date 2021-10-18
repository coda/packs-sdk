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
    project: ['./tsconfig.eslint.json'],
    sourceType: 'module',
  },
  plugins: ['ban', 'filenames', 'local', '@typescript-eslint'],
  settings: {},
  rules: {
    '@typescript-eslint/restrict-plus-operands': 'error',
    'max-len': [
      'error',
      {
        code: 120,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignorePattern: '^import ',
      },
    ],
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

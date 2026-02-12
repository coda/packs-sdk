import tseslint from 'typescript-eslint';
import banPlugin from 'eslint-plugin-ban';
import checkFilePlugin from 'eslint-plugin-check-file';
import properArrowsPlugin from '@getify/eslint-plugin-proper-arrows';
import preferLetPlugin from 'eslint-plugin-prefer-let';
import {fixupPluginRules} from '@eslint/compat';
import globals from 'globals';

// Custom coda rules plugin (replaces eslint-plugin-local + .eslintplugin.js)
import {rules as codaRules} from './dev/eslint/eslint-plugin-coda-rules/index.js';
const codaPlugin = {rules: codaRules};

// ─── Global ignores (replaces .eslintignore) ────────────────────────────────
const ignoresConfig = {
  ignores: [
    '.githooks/*',
    '.idea/*',
    '.vscode/*',
    'node_modules/*',
    'dist/*',
  ],
};

// ─── Base config for all TS/JS files ────────────────────────────────────────
const baseConfig = {
  files: ['**/*.{ts,tsx,js,mjs,cjs,md}'],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      project: ['./tsconfig.eslint.json'],
      sourceType: 'module',
      extraFileExtensions: ['.md'],
    },
    globals: {
      ...globals.browser,
      ...globals.commonjs,
      ...globals.es2021,
      ...globals.node,
      ...globals.mocha,
      ...globals.jest,
    },
  },
  plugins: {
    '@typescript-eslint': tseslint.plugin,
    'ban': fixupPluginRules(banPlugin),
    'check-file': checkFilePlugin,
    'coda': codaPlugin,
    '@getify/proper-arrows': fixupPluginRules(properArrowsPlugin),
    'prefer-let': fixupPluginRules(preferLetPlugin),
  },
  rules: {
    // ── typescript-eslint rules ──────────────────────────────────────────
    '@typescript-eslint/adjacent-overload-signatures': 'error',
    '@typescript-eslint/array-type': ['error', {default: 'array-simple', readonly: 'array-simple'}],
    '@typescript-eslint/no-restricted-types': [
      'error',
      {
        types: {
          Object: {message: 'Avoid using the `Object` type. Did you mean `object`?'},
          Function: {message: 'Avoid using the `Function` type. Prefer a specific function type, like `() => void`.'},
          Boolean: {message: 'Avoid using the `Boolean` type. Did you mean `boolean`?'},
          Number: {message: 'Avoid using the `Number` type. Did you mean `number`?'},
          String: {message: 'Avoid using the `String` type. Did you mean `string`?'},
          Symbol: {message: 'Avoid using the `Symbol` type. Did you mean `symbol`?'},
        },
      },
    ],
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'no-public',
        overrides: {
          constructors: 'off',
        },
      },
    ],
    '@typescript-eslint/consistent-type-assertions': [
      'error',
      {
        assertionStyle: 'as',
        objectLiteralTypeAssertions: 'allow',
      },
    ],
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'class',
        format: ['PascalCase'],
      },
    ],
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-floating-promises': ['error', {ignoreVoid: true}],
    '@typescript-eslint/no-misused-new': 'error',
    '@typescript-eslint/no-namespace': ['error', {allowDeclarations: true}],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/parameter-properties': 'error',
    '@typescript-eslint/no-unused-expressions': ['error', {allowShortCircuit: true, allowTernary: true}],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {vars: 'all', ignoreRestSiblings: true, varsIgnorePattern: '_.*', argsIgnorePattern: '_.*', caughtErrors: 'none'},
    ],
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/prefer-namespace-keyword': 'error',
    '@typescript-eslint/restrict-plus-operands': 'error',
    '@typescript-eslint/triple-slash-reference': ['error', {path: 'never', types: 'never', lib: 'never'}],
    '@typescript-eslint/unified-signatures': 'error',

    // ── eslint-plugin-ban ────────────────────────────────────────────────
    'ban/ban': [
      'error',
      {
        name: ['Promise', 'race'],
        message: 'Avoid Promise.race since it can lead to memory leaks.',
      },
      {
        name: ['*', 'spread'],
        message: 'Use Promise#then(([...]) => ...) instead of Promise#spread for correctly-inferred types.',
      },
      {
        name: ['it', 'only'],
        message: 'Do not commit Mocha it.only',
      },
      {
        name: ['describe', 'only'],
        message: 'Do not commit Mocha describe.only',
      },
    ],

    // ── eslint-plugin-check-file (replaces eslint-plugin-filenames) ──────
    'check-file/filename-naming-convention': [
      'error',
      {'**/*.{ts,tsx,js,mjs,cjs}': 'SNAKE_CASE'},
      {ignoreMiddleExtensions: true, checkTypescriptDtsFiles: true},
    ],

    // ── ESLint built-in rules ────────────────────────────────────────────
    'arrow-parens': ['error', 'as-needed'],
    camelcase: ['error', {ignoreDestructuring: true, properties: 'never'}],
    complexity: 'off',
    'constructor-super': 'error',
    curly: 'error',
    'dot-notation': 'error',
    'eol-last': 'off',
    eqeqeq: ['error', 'always', {null: 'ignore'}],
    'guard-for-in': 'error',
    'jsx-quotes': ['error', 'prefer-double'],
    'linebreak-style': 'off',
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
    'max-classes-per-file': 'off',
    'member-ordering': 'off',
    'new-parens': 'off',
    'newline-per-chained-call': 'off',
    'no-bitwise': 'error',
    'no-caller': 'error',
    'no-cond-assign': 'error',
    'no-console': 'error',
    'no-debugger': 'error',
    'no-duplicate-case': 'error',
    'no-empty': 'off',
    'no-empty-functions': 'off',
    'no-eval': 'error',
    'no-extra-semi': 'off',
    'no-fallthrough': 'off',
    'no-invalid-this': 'off',
    'no-irregular-whitespace': 'off',
    'no-multiple-empty-lines': 'off',
    'no-new-wrappers': 'error',
    'no-return-await': 'error',
    'no-throw-literal': 'off',
    'no-undef-init': 'error',
    'no-unsafe-finally': 'error',
    'no-unused-labels': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'object-curly-spacing': ['error', 'never'],
    'one-var': ['error', 'never'],
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    'quote-props': ['error', 'as-needed'],
    quotes: ['error', 'single', {avoidEscape: true, allowTemplateLiterals: true}],
    radix: 'error',
    'space-before-function-paren': 'off',
    'spaced-comment': ['error', 'always', {exceptions: ['*']}],
    'use-isnan': 'error',
    'valid-typeof': 'off',

    // ── Custom coda rules ────────────────────────────────────────────────
    'coda/coda-import-style': 'error',
    'coda/coda-import-ordering': 'error',
  },
};

// ─── Override: test files ────────────────────────────────────────────────────
const testFilesConfig = {
  files: ['**/*_test.{ts,tsx}'],
  rules: {
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
  },
};

// ─── Override: .d.ts files ───────────────────────────────────────────────────
const dtsFilesConfig = {
  files: ['**/*.d.ts'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    camelcase: 'off',
  },
};

// ─── Override: eslint.config.mjs (disable filename check) ────────────────────
const eslintConfigOverride = {
  files: ['eslint.config.mjs'],
  rules: {
    'check-file/filename-naming-convention': 'off',
  },
};

// ─── Override: documentation/samples/**/*.ts (stricter sample rules) ─────────
const sampleFilesConfig = {
  files: ['documentation/samples/**/*.ts'],
  rules: {
    'object-shorthand': ['error', 'never'],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        varsIgnorePattern: 'response|datasetUrl|MySchema|snippet|data|parameters|row|_',
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
    semi: ['error', 'always'],
    'one-var': 'off',
  },
};

// ─── Override: docs/**/*.md (documentation rules) ────────────────────────────
const docsFilesConfig = {
  files: ['docs/**/*.md'],
  rules: {
    'check-file/filename-naming-convention': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-console': 'off',
    '@getify/proper-arrows/where': ['error', {global: false}],
    // Inherit the stricter sample rules for docs too
    'object-shorthand': ['error', 'never'],
    'max-len': ['error', {code: 80}],
    quotes: ['error', 'double'],
    'prefer-const': 'off',
    'prefer-let/prefer-let': 2,
    'prefer-template': 'off',
    '@typescript-eslint/restrict-plus-operands': 0,
    'func-style': ['error', 'declaration'],
    'prefer-arrow-callback': 'off',
    'object-curly-spacing': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    semi: ['error', 'always'],
    'one-var': 'off',
  },
};

export default [
  ignoresConfig,
  baseConfig,
  testFilesConfig,
  dtsFilesConfig,
  eslintConfigOverride,
  sampleFilesConfig,
  docsFilesConfig,
];

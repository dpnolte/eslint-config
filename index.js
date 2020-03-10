const isModuleInstalled = moduleName => {
  try {
    const modulePath = require.resolve(moduleName);
    return !!modulePath;
  } catch (e) {
    return false;
  }
};

// TODO: add vue?
const hasReact = isModuleInstalled('react');
const hasReactNative = isModuleInstalled('react-native');
const hasDetox = hasReactNative && isModuleInstalled('detox');

const settings = hasReact
  ? {
      react: {
        version: 'detect',
      },
    }
  : {};

const reactRules = hasReact ? require('./reactRules') : {};
const reactNativeRules = hasReactNative ? require('./reactNativeRules') : {};
const globals = hasReactNative ? require('./reactNativeGlobals') : {};

const ignorePatterns = ['node_modules/', 'ios/', 'android', '**/*.d.ts'];

const eslintConfig = {
  env: {
    es6: true,
    browser: true,
  },

  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
  },

  ignorePatterns,

  settings,

  globals,

  extends: [
    hasReact ? 'airbnb-typescript' : 'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
    'prettier/@typescript-eslint',
    hasReact && 'prettier/react',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ].filter(Boolean),

  plugins: [
    '@typescript-eslint',
    'babel',
    'import',
    'jest',
    'jasmine',
    'json',
    'markdown',
    'prettier',
    hasReact && 'react',
    hasReact && 'react-hooks',
    hasReactNative && 'react-native',
  ].filter(Boolean),

  rules: {
    'constructor-super': 'error',
    'for-direction': 'error',
    'getter-return': 'error',
    'no-case-declarations': 'error',
    'no-class-assign': 'error',
    'no-compare-neg-zero': 'error',
    'no-cond-assign': 'error',
    'no-const-assign': 'error',
    'no-constant-condition': 'error',
    'no-control-regex': 'error',
    'no-delete-var': 'error',
    'no-dupe-args': 'error',
    'no-dupe-class-members': 'error',
    'no-dupe-keys': 'error',
    'no-duplicate-case': 'error',
    'no-empty-character-class': 'error',
    'no-empty-pattern': 'error',
    'no-empty': 'error',
    'no-ex-assign': 'error',
    'no-extra-boolean-cast': 'error',
    'no-extra-semi': 'error',
    'no-fallthrough': 'error',
    'no-func-assign': 'error',
    'no-global-assign': 'error',
    'no-inner-declarations': 'error',
    'no-invalid-regexp': 'error',
    'no-misleading-character-class': 'error',
    'no-new-symbol': 'error',
    'no-obj-calls': 'error',
    'no-octal': 'error',
    'no-redeclare': 'error',
    'no-regex-spaces': 'error',
    'no-self-assign': 'error',
    'no-sparse-arrays': 'error',
    'no-this-before-super': 'error',
    'no-undef': 'error',
    'no-unexpected-multiline': 'error',
    'no-unreachable': 'error',
    'no-unsafe-finally': 'error',
    'no-unsafe-negation': 'error',
    'no-unused-labels': 'error',
    'no-unused-vars': 'error',
    quotes: ['error', 'single', { avoidEscape: true }],
    'require-yield': 'error',
    'use-isnan': 'error',

    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/interface-name-prefix': 'error', // I prefix interface prefix with I
    '@typescript-eslint/no-use-before-define': ['error', { variables: false }], // Need this off for variable so that we can use styles before Stylesheet.create
    '@typescript-eslint/explicit-member-accessibility': 'off',

    'babel/no-invalid-this': 'error',
    'babel/no-unused-expressions': ['error', { allowShortCircuit: true }],
    'babel/valid-typeof': 'error',

    'import/default': 'error',
    'import/export': 'error',
    'import/extensions': ['error', { js: 'never', json: 'always' }],
    'import/imports-first': 'error',
    'import/named': 'error',
    'import/namespace': 'error',
    'import/no-amd': 'error',
    'import/no-commonjs': 'error',
    'import/no-duplicates': 'error',
    'import/no-extraneous-dependencies': 'error',
    'import/no-unresolved': 'error',
    'import/prefer-default-export': 'off',

    'jest/consistent-test-it': ['error', { fn: 'it' }],
    'jest/no-disabled-tests': 'error',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/no-jasmine-globals': 'error',
    'jest/no-test-prefixes': 'error',
    'jest/no-test-return-statement': 'error',
    'jest/no-truthy-falsy': 'error',
    'jest/prefer-todo': 'error',
    'jest/valid-describe': 'error',
    'jest/valid-expect-in-promise': 'error',
    'jest/valid-expect': 'error',

    ...reactRules,

    ...reactNativeRules,

    'prettier/prettier': [
      'error',
      {
        tabWidth: 2,
        useTabs: false,
        singleQuote: true,
        trailingComma: 'es5',
      },
    ],
  },
  overrides: [
    {
      files: ['*.js'],
      parser: require.resolve('babel-eslint'),
      excludedFiles: ignorePatterns,
    },
    {
      files: ['*.ts', '*.tsx'],
      excludedFiles: ignorePatterns,
      parser: require.resolve('@typescript-eslint/parser'),
      plugins: ['@typescript-eslint/eslint-plugin'],
      settings: {
        'import/extensions': ['.js', '.ts', '.tsx'],
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
          node: {
            extensions: ['.js', '.ts', '.tsx'],
          },
        },
      },
      rules: {
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

        'no-dupe-class-members': 'off',
        'no-unused-vars': 'off',

        'import/named': 'off',
      },
    },
    {
      files: [
        '*.{spec,test}.{js,ts,tsx}',
        '**/{__tests__,e2e,test,tests}/**/*.{js,ts,tsx}',
        '**/setupJest.js',
      ],
      excludedFiles: ignorePatterns,
      env: {
        jasmine: true,
        jest: true,
        'jest/globals': true,
      },
      globals: hasDetox
        ? {
            ...globals,
            ...require('./detoxGlobals'),
          }
        : globals,
      rules: {
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      },
    },
  ],
};

module.exports = eslintConfig;

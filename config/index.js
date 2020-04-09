const path = require('path');
const fs = require('fs-extra');

const isModuleInstalled = moduleName => {
  try {
    const modulePath = require.resolve(moduleName);
    return !!modulePath;
  } catch (error) {
    return false;
  }
};

// TODO: add vue?
const hasReact = isModuleInstalled('react');
const hasReactNative = isModuleInstalled('react-native');
const hasDetox = hasReactNative && isModuleInstalled('detox');
const typescriptProjectPath = path.resolve(process.cwd(), 'tsconfig.json');
const isTypescriptProject = fs.existsSync(typescriptProjectPath);

const settings = {
  // Apply special parsing for TypeScript files
  'import/parsers': {
    '@typescript-eslint/parser': ['.ts', '.tsx', '.d.ts'],
  },
  // Append 'ts' extensions to Airbnb 'import/resolver' setting
  'import/resolver': {
    node: {
      extensions: ['.mjs', '.js', '.ts', '.tsx', '.json'],
    },
  },
  // Append 'ts' extensions to Airbnb 'import/extensions' setting
  'import/extensions': ['.js', '.mjs', '.jsx', '.ts', '.tsx'],
};

if (hasReact) {
  settings.react = {
    version: 'detect',
  };
}

const globals = hasReactNative ? require('./reactNativeGlobals') : {};
const reactNativeRules = hasReactNative ? require('./reactNativeRules') : {};
const reactTypescriptRules =
  hasReact && isTypescriptProject ? require('./reactTypescriptRules') : {};

const ignorePatterns = [
  'node_modules/',
  'ios/',
  'android',
  '**/*.d.ts',
  'babel.config.js',
  'prettier.config.js',
  'metro.config.js',
  'dist/',
  'build/',
  'jest.config.js',
  'serviceWorker.js',
];

const parserOptions = isTypescriptProject
  ? {
      project: typescriptProjectPath,
      sourceType: 'module',
    }
  : undefined;

module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true,
  },

  settings,

  globals,

  ignorePatterns,

  plugins: [
    isTypescriptProject && '@typescript-eslint',
    'eslint-comments',
    'jest',
    'promise',
    'unicorn',
    hasReact && 'react',
    hasReactNative && 'react-native',
    hasReactNative && '@react-native-community',
  ].filter(Boolean),

  extends: [
    hasReact ? 'airbnb' : 'airbnb/base',
    'plugin:eslint-comments/recommended',
    'plugin:jest/recommended',
    'plugin:promise/recommended',
    'plugin:unicorn/recommended',
    hasReact && 'airbnb/hooks',
    'prettier',
    hasReact && 'prettier/react',
  ].filter(Boolean),

  parserOptions,

  rules: {
    // import ruels
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        mjs: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],

    // consistent exported names everywhere
    // https://basarat.gitbooks.io/typescript/docs/tips/defaultIsBad.html
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',

    // unicorn, https://github.com/sindresorhus/eslint-plugin-unicorn
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          camelCase: true,
          pascalCase: true,
        },
      },
    ],
    // common abbreviations that are known and readable
    'unicorn/prevent-abbreviations': 'off',

    // for react, we use airbnb rules
    ...reactNativeRules,
  },

  overrides: [
    isTypescriptProject && {
      // enable the rule specifically for TypeScript files
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      rules: {
        // import typescript specific rules
        ...require('eslint-config-airbnb-typescript/lib/shared').rules,
        ...require('@typescript-eslint/eslint-plugin/dist/configs/recommended.json').rules,
        // disable prettier formattings rules
        ...require('eslint-config-prettier/@typescript-eslint').rules,

        ...reactTypescriptRules,

        // Need variables off for being able to use styles before defining it with Stylesheet.create
        // https://github.com/Intellicode/eslint-plugin-react-native/issues/22
        '@typescript-eslint/no-use-before-define': [
          'error',
          { functions: false, variables: false, classes: true, typedefs: true },
        ],
        // disable for vars named _
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

        // Makes no sense to allow type inferrence for expression parameters, but require typing the response
        '@typescript-eslint/explicit-function-return-type': [
          'error',
          { allowExpressions: true, allowTypedFunctionExpressions: true },
        ],

        // turn of react prop types as we type with typescript
        'react/prop-types': hasReact ? 'off' : undefined,

        // Disable `no-undef` rule within TypeScript files because it incorrectly errors when exporting default interfaces
        // https://github.com/iamturns/eslint-config-airbnb-typescript/issues/50
        // This will be caught by TypeScript compiler if `strictNullChecks` (or `strict`) is enabled
        'no-undef': 'off',
      },
    },
    {
      files: [
        '*.{spec,test}.{js,ts,tsx}',
        '**/{__tests__,e2e,test,tests}/**/*.{js,ts,tsx}',
        '**/setupJest.js',
      ],
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
        // enable dev dependencies within tests
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
        // can use inline styles within tests
        'react-native/no-inline-styles': 0,
      },
    },
  ].filter(Boolean),
};

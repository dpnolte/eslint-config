const defaultConfig = require('./index');

// console.log(JSON.stringify(defaultConfig, null, 2));

// change some rules to accomodate this common js package
module.exports = {
  ...defaultConfig,
  root: true,
  rules: {
    ...defaultConfig.rules,

    'global-require': 'off',
    'no-console': 'off',

    'import/no-commonjs': 'off',
    'import/no-dynamic-require': 'off',

    '@typescript-eslint/no-var-requires': 'off',
  },
};

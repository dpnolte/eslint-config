#!/usr/bin/env node

require('yargs') // eslint-disable-line
  .command(
    'init',
    'set up eslint and typescript',
    () => {},
    () => {
      console.log('❤️️️ Installing typescript, eslint and prettier config files ❤️');
      console.log('-'.repeat(20));

      require('../scripts/install');

      console.log('-'.repeat(20));
    }
  ).argv;

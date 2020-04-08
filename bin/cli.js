#!/usr/bin/env node

const { command } = require('yargs');

// eslint-disable-next-line no-unused-expressions
command(
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

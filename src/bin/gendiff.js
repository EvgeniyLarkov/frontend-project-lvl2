#!/usr/bin/env node

import program from 'commander';
// import gendiff from '..';

program.version('0.0.1');
program.arguments('<firstConfig> <secondConfig>');
program.description('Compares two configuration files and shows a difference.');
program.option('-f, --format [type]', 'output format');
program.parse(process.argv);

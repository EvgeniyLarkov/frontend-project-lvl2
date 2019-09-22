#!/usr/bin/env node

import program from 'commander';
import gendiff from '..';

program
  .version('0.0.1')
  .arguments('<firstConfig> <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format', 'pretty')
  .action((path1, path2) => {
    console.log(gendiff(path1, path2, program.format));
  })
  .parse(process.argv);

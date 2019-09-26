#!/usr/bin/env node

import program from 'commander';
import gendiff from '..';

program
  .version('0.0.1')
  .arguments('<firstConfig> <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format', 'pretty')
  .action((filePath1, filePath2) => {
    console.log(gendiff(filePath1, filePath2, program.format));
  })
  .parse(process.argv);

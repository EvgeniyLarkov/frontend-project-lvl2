#!/usr/bin/env node

import { has } from 'lodash/fp';
import parser from '../parsers';

const program = require('commander');

program.version('0.0.1');
program.arguments('<firstConfig> <secondConfig>');
program.description('Compares two configuration files and shows a difference.');
program.option('-f, --format [type]', 'output format');
program.parse(process.argv);

export const findDifferencies = (firstConfig, secondConfig) => {
  const differencies = Object.keys(firstConfig).reduce((acc, key) => {
    if (has(key)(secondConfig)) {
      if (secondConfig[key] === firstConfig[key]) {
        return [...acc, `  ${key}: ${firstConfig[key]}`];
      }
      return [...acc,
        `+ ${key}: ${secondConfig[key]}`,
        `- ${key}: ${firstConfig[key]}`];
    }
    return [...acc, `- ${key}: ${firstConfig[key]}`];
  }, []);

  const addedProperties = Object.keys(secondConfig)
    .filter((key) => !has(key)(firstConfig))
    .map((key) => `+ ${key}: ${secondConfig[key]}`);
  return differencies.concat(addedProperties);
};

export const buildResult = (differencies) => `{\n${differencies.join('\n')}\n}`;

export default (pathToFile1, pathToFile2) => {
  const parsedFiles = parser(pathToFile1, pathToFile2);
  const differencies = findDifferencies(...parsedFiles);
  return buildResult(differencies);
};

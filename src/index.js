import { has } from 'lodash/fp';
import * as fs from 'fs';
import { extname } from 'path';
import parse from './parsers';
import stairlike from './formatters/stairlike';
import plain from './formatters/plain';
import jsonify from './formatters/json';

const findDifferencies = (firstConfig, secondConfig) => {
  const differencies = Object.keys(firstConfig).reduce((acc, key) => {
    if (has(key)(secondConfig)) {
      if (firstConfig[key] instanceof Object && secondConfig[key] instanceof Object) {
        return [...acc, { key, children: findDifferencies(firstConfig[key], secondConfig[key]), status: 'hasChild' }];
      }
      if (secondConfig[key] === firstConfig[key]) {
        return [...acc, { key, beforeValue: firstConfig[key], status: 'notChanged' }];
      }
      return [...acc, {
        key, beforeValue: firstConfig[key], status: 'changed', afterValue: secondConfig[key],
      }];
    }
    return [...acc, { key, beforeValue: firstConfig[key], status: 'deleted' }];
  }, []);
  const addedProperties = Object.keys(secondConfig)
    .filter((key) => !has(key)(firstConfig))
    .map((key) => ({ key, afterValue: secondConfig[key], status: 'added' }));
  return differencies.concat(addedProperties);
};

export default (pathToFile1, pathToFile2, format = 'json') => {
  const formatters = {
    stairlike: (data) => stairlike(data),
    plain: (data) => plain(data),
    json: (data) => jsonify(data),
  };
  const filesExtension = extname(pathToFile1);
  const firstConfig = fs.readFileSync(pathToFile1, 'utf8');
  const secondConfig = fs.readFileSync(pathToFile2, 'utf8');
  const parsedFiles = parse(firstConfig, secondConfig, filesExtension);
  const differencies = findDifferencies(...parsedFiles);
  return formatters[format](differencies);
};

// to DO: отрефакторить stairlike
// изменить названия в formatters (item, key) в функциях
// прикрутить в бине вызовы в commander'e
// разобраться с test coverage

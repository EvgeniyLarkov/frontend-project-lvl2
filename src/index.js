import { has, flatten } from 'lodash/fp';
import * as fs from 'fs';
import { extname } from 'path';
import parser from './parsers';

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

const render = (data) => {
  const buildResult = (tree, treeDepth) => {
    const buildString = (value) => ((value instanceof Object)
      ? `{\n${buildResult(value, treeDepth + 2)}\n${'  '.repeat(treeDepth)}  }`
      : value);
    const statusActions = {
      added: (item) => [`+ ${item.key}: `, buildString(item.afterValue)],
      changed: (item) => [...statusActions.added(item), `\n${'  '.repeat(treeDepth)}`, ...statusActions.deleted(item)],
      deleted: (item) => [`- ${item.key}: `, buildString(item.beforeValue)],
      notChanged: (item) => [`  ${item.key}: `, buildString(item.beforeValue)],
      hasChild: (item) => [`  ${item.key}: `, buildString(item.children)],
    };
    if (!Array.isArray(tree)) {
      return Object.keys(tree).map((key) => [`${'  '.repeat(treeDepth)}  ${key}: ${tree[key]}`]).join('\n');
    }
    const result = tree.map((item) => statusActions[item.status](item).join(''));
    return flatten(result).map((item) => '  '.repeat(treeDepth) + item).join('\n');
  };
  return `{\n${buildResult(data, 1)}\n}`;
};

export default (pathToFile1, pathToFile2) => {
  const filesExtension = extname(pathToFile1);
  const firstConfig = fs.readFileSync(pathToFile1, 'utf8');
  const secondConfig = fs.readFileSync(pathToFile2, 'utf8');
  const parsedFiles = parser(firstConfig, secondConfig, filesExtension);
  const differencies = findDifferencies(...parsedFiles);
  return render(differencies);
};

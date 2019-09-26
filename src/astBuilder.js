import { has, union, isObject } from 'lodash';

const keysActions = [
  {
    type: 'hasChild',
    check: (a, b, key) => isObject(a[key]) && isObject(b[key]),
    action: (beforeValue, afterValue, getAst) => ({ children: getAst(beforeValue, afterValue) }),
  },
  {
    type: 'changed',
    check: (a, b, key) => has(a, key) && has(b, key) && (a[key] !== b[key]),
    action: (beforeValue, afterValue) => ({ beforeValue, afterValue }),
  },
  {
    type: 'notChanged',
    check: (a, b, key) => has(a, key) && has(b, key) && a[key] === b[key],
    action: (beforeValue) => ({ beforeValue }),
  },
  {
    type: 'deleted',
    check: (a, b, key) => has(a, key) && !has(b, key),
    action: (beforeValue) => ({ beforeValue }),
  },
  {
    type: 'added',
    check: (a, b, key) => !has(a, key) && has(b, key),
    action: (beforeValue, afterValue) => ({ afterValue }),
  },
];

const genDifferencies = (firstConfig, secondConfig) => {
  const configsKeys = union(Object.keys(firstConfig), Object.keys(secondConfig));
  return configsKeys.sort().map((key) => {
    const { type, action } = keysActions.find(
      ({ check }) => check(firstConfig, secondConfig, key),
    );
    return { key, type, ...action(firstConfig[key], secondConfig[key], getDifferencies) };
  });
};

export default genDifferencies;

import { has, union, isObject } from 'lodash/fp';

const keysActions = [
  {
    status: 'hasChild',
    check: (a, b, key) => isObject(a[key]) && isObject(b[key]),
    action: (beforeValue, afterValue, getAst) => ({ children: getAst(beforeValue, afterValue) }),
  },
  {
    status: 'changed',
    check: (a, b, key) => has(key)(a) && has(key)(b) && (a[key] !== b[key]),
    action: (beforeValue, afterValue) => ({ beforeValue, afterValue }),
  },
  {
    status: 'notChanged',
    check: (a, b, key) => has(key)(a) && has(key)(b) && a[key] === b[key],
    action: (beforeValue) => ({ beforeValue }),
  },
  {
    status: 'deleted',
    check: (a, b, key) => has(key)(a) && !has(key)(b),
    action: (beforeValue) => ({ beforeValue }),
  },
  {
    status: 'added',
    check: (a, b, key) => !has(key)(a) && has(key)(b),
    action: (beforeValue, afterValue) => ({ afterValue }),
  },
];

const getDiff = (firstConfig, secondConfig) => {
  const configsKeys = union(Object.keys(firstConfig))(Object.keys(secondConfig));
  return configsKeys.sort().map((key) => {
    const { status, action } = keysActions.find(
      ({ check }) => check(firstConfig, secondConfig, key),
    );
    return { key, status, ...action(firstConfig[key], secondConfig[key], getDiff) };
  });
};

export default getDiff;

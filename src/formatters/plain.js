import { flatten, isObject } from 'lodash';

const buildRoot = (key, root) => `'${[...root, key].join('.')}'`;

const buildValue = (value) => {
  if (isObject(value)) {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value;
};

const typeActions = {
  added: (item, treeRoot) => `Property ${buildRoot(item.key, treeRoot)} was added with value: ${buildValue(item.afterValue)}`,
  changed: (item, treeRoot) => `Property ${buildRoot(item.key, treeRoot)} was updated. From ${buildValue(item.beforeValue)} to ${buildValue(item.afterValue)}`,
  deleted: (item, treeRoot) => `Property ${buildRoot(item.key, treeRoot)} was removed`,
  hasChild: (item, treeRoot, buildResult) => buildResult(item.children, [...treeRoot, item.key]),
};

export default (data) => {
  const buildResult = (tree, treeRoot) => {
    const result = tree.filter(({ type }) => type !== 'notChanged')
      .map((item) => typeActions[item.type](item, treeRoot, buildResult));
    return flatten(result);
  };
  return buildResult(data, []).join('\n');
};

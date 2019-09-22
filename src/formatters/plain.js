import { flatten } from 'lodash/fp';

export default (data) => {
  const buildResult = (tree, treeRoot) => {
    const buildRoot = (key) => `'${[...treeRoot, key].join('.')}'`;
    const buildValue = (value) => {
      if (value instanceof Object) {
        return '[complex value]';
      }
      if (typeof value === 'string') {
        return `'${value}'`;
      }
      return value;
    };
    const statusActions = {
      added: (item) => `Property ${buildRoot(item.key)} was added with value: ${buildValue(item.afterValue)}`,
      changed: (item) => `Property ${buildRoot(item.key)} was updated. From ${buildValue(item.beforeValue)} to ${buildValue(item.afterValue)}`,
      deleted: (item) => `Property ${buildRoot(item.key)} was removed`,
      hasChild: (item) => buildResult(item.children, [...treeRoot, item.key]),
    };
    const result = tree.filter(({ status }) => status !== 'notChanged')
      .map((item) => statusActions[item.status](item));
    return flatten(result);
  };
  return buildResult(data, []).join('\n');
};

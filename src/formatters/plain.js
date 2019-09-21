import { flatten } from 'lodash/fp';

export default (data) => {
  const buildResult = (tree, treeRoot) => {
    const buildRoot = (key) => `'${[...treeRoot, key].join('.')}'`;
    const buildString = (item) => {
      if (item instanceof Object) {
        return '[complex value]';
      }
      if (typeof item === 'string') {
        return `'${item}'`;
      }
      return item;
    };
    const statusActions = {
      added: (item) => `Property ${buildRoot(item.key)} was added with value: ${buildString(item.afterValue)}`,
      changed: (item) => `Property ${buildRoot(item.key)} was updated. From ${buildString(item.beforeValue)} to ${buildString(item.afterValue)}`,
      deleted: (item) => `Property ${buildRoot(item.key)} was removed`,
      hasChild: (item) => buildResult(item.children, [...treeRoot, item.key]),
    };
    const result = tree.filter(({ status }) => status !== 'notChanged')
      .map((item) => statusActions[item.status](item));
    return flatten(result);
  };
  return buildResult(data, []).join('\n');
};

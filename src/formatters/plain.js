import { flatten } from 'lodash';

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
    const typeActions = {
      added: (item) => `Property ${buildRoot(item.key)} was added with value: ${buildValue(item.afterValue)}`,
      changed: (item) => `Property ${buildRoot(item.key)} was updated. From ${buildValue(item.beforeValue)} to ${buildValue(item.afterValue)}`,
      deleted: (item) => `Property ${buildRoot(item.key)} was removed`,
      hasChild: (item) => buildResult(item.children, [...treeRoot, item.key]),
    };
    const result = tree.filter(({ type }) => type !== 'notChanged')
      .map((item) => typeActions[item.type](item));
    return flatten(result);
  };
  return buildResult(data, []).join('\n');
};

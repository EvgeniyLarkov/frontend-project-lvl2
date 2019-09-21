import { flatten } from 'lodash/fp';

export default (data) => {
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

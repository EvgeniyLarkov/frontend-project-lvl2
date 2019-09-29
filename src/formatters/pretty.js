import { flatten } from 'lodash';

const buildValue = (value, build, treeDepth) => ((value instanceof Object)
  ? `{\n${build(value, treeDepth + 2)}\n${'  '.repeat(treeDepth)}  }`
  : value);

export default (data) => {
  const buildResult = (tree, treeDepth) => {
    if (!Array.isArray(tree)) {
      return Object.keys(tree).map((key) => [`${'  '.repeat(treeDepth)}  ${key}: ${tree[key]}`]).join('\n');
    }
    const typeActions = {
      added: (item) => `+ ${item.key}: ${buildValue(item.afterValue, buildResult, treeDepth)}`,
      changed: (item) => [`${typeActions.added(item)}`, `${typeActions.deleted(item)}`],
      deleted: (item) => `- ${item.key}: ${buildValue(item.beforeValue, buildResult, treeDepth)}`,
      notChanged: (item) => `  ${item.key}: ${buildValue(item.beforeValue, buildResult, treeDepth)}`,
      hasChild: (item) => `  ${item.key}: ${buildValue(item.children, buildResult, treeDepth)}`,
    };
    const result = tree.map((item) => typeActions[item.type](item));
    return flatten(result).map((item) => `${'  '.repeat(treeDepth)}${item}`).join('\n');
  };
  return `{\n${buildResult(data, 1)}\n}`;
};

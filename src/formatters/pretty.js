import { flatten, isObject, isArray } from 'lodash';

const buildValue = (value, build, treeDepth) => {
  if (isArray(value)) {
    return `{\n${build(value, treeDepth + 2)}\n${'  '.repeat(treeDepth)}  }`;
  }
  if (isObject(value)) {
    const result = Object.keys(value).map((key) => [`${'  '.repeat(treeDepth + 2)}  ${key}: ${value[key]}`]).join('\n');
    return `{\n${result}\n${'  '.repeat(treeDepth)}  }`;
  }
  return value;
};

const typeActions = {
  added: (item, build, depth) => `+ ${item.key}: ${buildValue(item.afterValue, build, depth)}`,
  changed: (item, build, depth) => [`${typeActions.added(item, build, depth)}`, `${typeActions.deleted(item, build, depth)}`],
  deleted: (item, build, depth) => `- ${item.key}: ${buildValue(item.beforeValue, build, depth)}`,
  notChanged: (item, build, depth) => `  ${item.key}: ${buildValue(item.beforeValue, build, depth)}`,
  hasChild: (item, build, depth) => `  ${item.key}: ${buildValue(item.children, build, depth)}`,
};

export default (data) => {
  const buildResult = (tree, treeDepth) => {
    const result = tree.map((item) => typeActions[item.type](item, buildResult, treeDepth));
    return flatten(result).map((item) => `${'  '.repeat(treeDepth)}${item}`).join('\n');
  };
  return `{\n${buildResult(data, 1)}\n}`;
};

import parse from './parsers';
import getAst from './astBuilder';
import formatters from './formatters';

export default (filePath1, filePath2, format = 'json') => {
  const parsedConfigs = parse(filePath1, filePath2);
  const ast = getAst(...parsedConfigs);
  return formatters(format)(ast);
};

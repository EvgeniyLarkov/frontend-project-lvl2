import { readFileSync } from 'fs';
import { extname } from 'path';
import parse from './parsers';
import getAst from './astBuilder';
import formatters from './formatters';

export default (filePath1, filePath2, format = 'json') => {
  const filesExtension = extname(filePath1).slice(1);
  const firstConfig = readFileSync(filePath1, 'utf8');
  const secondConfig = readFileSync(filePath2, 'utf8');
  const parsedConfigs = parse(firstConfig, secondConfig, filesExtension);
  const ast = getAst(...parsedConfigs);
  return formatters(format)(ast);
};

import { readFileSync } from 'fs';
import { extname } from 'path';
import parse from './parsers';
import getAst from './astBuilder';
import formatAst from './formatters';

export default (filePath1, filePath2, format = 'json') => {
  const configExtension1 = extname(filePath1).slice(1);
  const configExtension2 = extname(filePath2).slice(1);

  const firstConfig = readFileSync(filePath1, 'utf8');
  const secondConfig = readFileSync(filePath2, 'utf8');

  const parsedConfig1 = parse(firstConfig, configExtension1);
  const parsedConfig2 = parse(secondConfig, configExtension2);

  const ast = getAst(parsedConfig1, parsedConfig2);
  return formatAst(format)(ast);
};

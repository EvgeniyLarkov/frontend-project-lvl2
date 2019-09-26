import { extname } from 'path';
import { readFileSync } from 'fs';
import yaml from 'js-yaml';
import ini from 'ini';

export default (filePath1, filePath2) => {
  const firstConfig = readFileSync(filePath1, 'utf8');
  const secondConfig = readFileSync(filePath2, 'utf8');
  const filesExtension = extname(filePath1);
  const parsers = {
    '.yaml': yaml.safeLoad,
    '.json': JSON.parse,
    '.ini': ini.parse,
  };
  return [parsers[filesExtension](firstConfig), parsers[filesExtension](secondConfig)];
};

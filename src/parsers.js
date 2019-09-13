import { extname } from 'path';
import * as yaml from 'js-yaml';
import * as ini from 'iniparser';
import * as fs from 'fs';

export default (pathToFile1, pathToFile2) => {
  const file1 = fs.readFileSync(pathToFile1, 'utf8');
  const file2 = fs.readFileSync(pathToFile2, 'utf8');
  const fileExtension = extname(pathToFile1);

  const parsers = {
    '.yaml': (file) => yaml.safeLoad(file),
    '.json': (file) => JSON.parse(file),
    '.ini': (file) => ini.parseString(file),
  };
  return [parsers[fileExtension](file1), parsers[fileExtension](file2)];
};

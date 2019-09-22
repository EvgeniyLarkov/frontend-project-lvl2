import * as fs from 'fs';
import { extname } from 'path';
import parse from './parsers';
import getDiff from './astBuilder';
import pretty from './formatters/pretty';
import plain from './formatters/plain';
import jsonify from './formatters/json';

export default (filePath1, filePath2, format = 'json') => {
  const formatters = {
    pretty: (data) => pretty(data),
    plain: (data) => plain(data),
    json: (data) => jsonify(data),
  };
  const filesExtension = extname(filePath1);
  const firstConfig = fs.readFileSync(filePath1, 'utf8');
  const secondConfig = fs.readFileSync(filePath2, 'utf8');
  const parsedFiles = parse(firstConfig, secondConfig, filesExtension);
  const differencies = getDiff(...parsedFiles);
  return formatters[format](differencies);
};

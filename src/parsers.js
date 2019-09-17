import * as yaml from 'js-yaml';
import * as ini from 'ini';

export default (firstConfig, secondConfig, filesExtension) => {
  const parsers = {
    '.yaml': (file) => yaml.safeLoad(file),
    '.json': (file) => JSON.parse(file),
    '.ini': (file) => ini.parse(file),
  };
  return [parsers[filesExtension](firstConfig), parsers[filesExtension](secondConfig)];
};

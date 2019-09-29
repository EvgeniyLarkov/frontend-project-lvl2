import yaml from 'js-yaml';
import ini from 'ini';

export default (firstConfig, secondConfig, filesExtension) => {
  const parsers = {
    yaml: yaml.safeLoad,
    json: JSON.parse,
    ini: ini.parse,
  };
  return [parsers[filesExtension](firstConfig), parsers[filesExtension](secondConfig)];
};

import yaml from 'js-yaml';
import ini from 'ini';

const parsers = {
  yaml: yaml.safeLoad,
  json: JSON.parse,
  ini: ini.parse,
};

export default (config, extension) => parsers[extension](config);

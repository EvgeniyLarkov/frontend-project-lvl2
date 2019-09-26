import pretty from './pretty';
import plain from './plain';
import jsonify from './json';

export default (format) => {
  const formatters = {
    pretty,
    plain,
    json: jsonify,
  };
  return formatters[format];
};

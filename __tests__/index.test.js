import { readFileSync } from 'fs';
import gendiff from '../src';

describe('various formats tests', () => {
  const extensions = ['json', 'ini', 'yaml'];
  const formats = ['Pretty', 'Plain', 'Json'];

  formats.forEach((format) => {
    test.each(extensions)(`format: ${format}`, (extension) => {
      const filePath1 = `${__dirname}/__fixtures__/testFile1Complex.${extension}`;
      const filePath2 = `${__dirname}/__fixtures__/testFile2Complex.${extension}`;
      const result = readFileSync(`${__dirname}/__fixtures__/result${format}`, 'utf-8');
      expect(gendiff(filePath1, filePath2, format.toLowerCase())).toBe(result);
    });
  });
});

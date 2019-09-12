import * as fs from 'fs';
import gendiff, { findDifferencies } from '../../src/bin/gendiff';


test('find differencies', () => {
  const before = {
    host: 'hexlet.io',
    timeout: 50,
    proxy: '123.234.53.22',
    follow: false,
  };
  const after = {
    timeout: 20,
    verbose: true,
    host: 'hexlet.io',
  };
  const result = [
    '  host: hexlet.io',
    '+ timeout: 20',
    '- timeout: 50',
    '- proxy: 123.234.53.22',
    '- follow: false',
    '+ verbose: true',
  ];
  expect(findDifferencies(before, after)).toHaveLength(result.length);
  expect(findDifferencies(before, after)).toStrictEqual(result);
});

test('empty object', () => {
  const before = {};
  const after = {};
  const result = [];
  expect(findDifferencies(before, after)).toStrictEqual(result);
});

test('flat json test', () => {
  const filePath1 = `${__dirname}/../__fixtures__/testFile1.json`;
  const filePath2 = `${__dirname}/../__fixtures__/testFile2.json`;
  const result = fs.readFileSync(`${__dirname}/../__fixtures__/jsonparseResult`, 'utf-8');
  expect(gendiff(filePath1, filePath2)).toBe(result);
});

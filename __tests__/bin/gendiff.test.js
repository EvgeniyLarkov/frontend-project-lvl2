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
  const before = `{
  "host": "hexlet.io",
  "timeout": 50,
  "proxy": "123.234.53.22",
  "follow": false
  }`;

  const after = `{
  "timeout": 20,
  "verbose": true,
  "host": "hexlet.io"
  }`;

  const result = `{
  host: hexlet.io
+ timeout: 20
- timeout: 50
- proxy: 123.234.53.22
- follow: false
+ verbose: true
}`;

  fs.writeFileSync('testfile1.json', before);
  fs.writeFileSync('testfile2.json', after);

  expect(gendiff('testfile1.json', 'testfile2.json')).toBe(result);

  fs.unlinkSync('testfile1.json');
  fs.unlinkSync('testfile2.json');
});

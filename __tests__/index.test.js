import * as fs from 'fs';
import gendiff from '../src';

describe('various formats tests', () => {
  const testFilesFlat = [
    [
      `${__dirname}/__fixtures__/testFile1.json`,
      `${__dirname}/__fixtures__/testFile2.json`],
    [
      `${__dirname}/__fixtures__/testFile1.yaml`,
      `${__dirname}/__fixtures__/testFile2.yaml`],
    [
      `${__dirname}/__fixtures__/testFile1.ini`,
      `${__dirname}/__fixtures__/testFile2.ini`],
  ];
  const testFilesComplex = [
    [
      `${__dirname}/__fixtures__/testFile1Complex.json`,
      `${__dirname}/__fixtures__/testFile2Complex.json`],
    [
      `${__dirname}/__fixtures__/testFile1Complex.yaml`,
      `${__dirname}/__fixtures__/testFile2Complex.yaml`],
    [
      `${__dirname}/__fixtures__/testFile1Complex.ini`,
      `${__dirname}/__fixtures__/testFile2Complex.ini`],
  ];
  const resultFlat = fs.readFileSync(`${__dirname}/__fixtures__/parseResult`, 'utf-8');
  const resultComplex = fs.readFileSync(`${__dirname}/__fixtures__/resultComplex`, 'utf-8');
  const resultPlain = fs.readFileSync(`${__dirname}/__fixtures__/resultPlain`, 'utf-8');
  const resultJson = fs.readFileSync(`${__dirname}/__fixtures__/resultJson`, 'utf-8');

  test.each(testFilesFlat)('flat test', (filePath1, filePath2) => {
    expect(gendiff(filePath1, filePath2, 'pretty')).toBe(resultFlat);
  });
  test.each(testFilesComplex)('pretty test', (filePath1, filePath2) => {
    expect(gendiff(filePath1, filePath2, 'pretty')).toBe(resultComplex);
  });
  test.each(testFilesComplex)('plain test', (filePath1, filePath2) => {
    expect(gendiff(filePath1, filePath2, 'plain')).toBe(resultPlain);
  });
  test.each(testFilesComplex)('json test', (filePath1, filePath2) => {
    expect(gendiff(filePath1, filePath2, 'json')).toBe(resultJson);
  });
});

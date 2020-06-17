const { readFileSync, createReadStream } = require("fs");
const { resolve } = require("path");
const { Readable } = require("stream");
const assert = require("assert").strict;

const { bufferReplace, streamReplace } = require("../lib/index");
const {
  bufferReplaceStringTest,
  streamReplaceStringTest,
} = require("./testsFromString");
const testStringData = require("./stringTestData");

const inputFilePath = resolve(__dirname, "text.txt");
const inputBuffer = readFileSync(inputFilePath);
const inputString = inputBuffer.toString();
const searchValue = "się";
const replaceValue = "TEST";
const targetString = inputString.replace(
  new RegExp(searchValue, "g"),
  replaceValue
);

const argumentTypes = ["string", "buffer"];
const getValue = (string, type) =>
  type === argumentTypes[0] ? string : Buffer.from(string);

describe("Testing replace functions", function () {
  describe("bufferReplace", function () {
    // test different input types
    for (const searchType of argumentTypes)
      for (const replaceType of argumentTypes)
        it(`should replace all instances of ${searchType} with instances of ${replaceType}`, function () {
          const replaced = bufferReplace(
            inputBuffer,
            getValue(searchValue, searchType),
            getValue(replaceValue, replaceType)
          );
          assert.equal(replaced.toString(), targetString);
        });

    // test string values
    for (const {
      comment,
      inputValue,
      searchValue,
      replaceValue,
    } of testStringData)
      it(
        comment,
        bufferReplaceStringTest(inputValue, searchValue, replaceValue)
      );
  });

  describe("streamReplace", function () {
    // test different input types
    for (const searchType of argumentTypes)
      for (const replaceType of argumentTypes)
        it(`should replace all instances of ${searchType} with instances of ${replaceType}`, async function () {
          const stream = createReadStream(inputFilePath).pipe(
            streamReplace(
              getValue(searchValue, searchType),
              getValue(replaceValue, replaceType)
            )
          );
          let data = "";
          for await (const chunk of stream) data += chunk.toString();
          assert.equal(data, targetString);
        });

    // test string values
    for (const {
      comment,
      inputValue,
      searchValue,
      replaceValue,
    } of testStringData)
      it(
        comment,
        streamReplaceStringTest(inputValue, searchValue, replaceValue)
      );
  });
});

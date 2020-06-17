/**
 * Utilities to create tests from string values.
 */

const { Readable } = require("stream");
const assert = require("assert").strict;
const { bufferReplace, streamReplace } = require("../lib/index");

const streamReplaceStringTest = (
  inputValue,
  searchValue,
  replaceValue
) => async () => {
  const stream = new Readable.from(inputValue).pipe(
    streamReplace(searchValue, replaceValue)
  );
  let data = "";
  for await (const chunk of stream) data += chunk.toString();
  assert.equal(
    data,
    inputValue.replace(new RegExp(searchValue, "g"), replaceValue)
  );
};

const bufferReplaceStringTest = (
  inputValue,
  searchValue,
  replaceValue
) => () => {
  const replaced = bufferReplace(
    Buffer.from(inputValue, { highWaterMark: 1 }),
    searchValue,
    replaceValue
  );
  assert.equal(
    replaced.toString(),
    inputValue.replace(new RegExp(searchValue, "g"), replaceValue)
  );
};

module.exports = {
  bufferReplaceStringTest,
  streamReplaceStringTest,
};

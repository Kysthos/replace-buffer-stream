import { Transform, TransformCallback } from "stream";

// a helper generator in case an empty searchValue would be passed
// to bufferReplace function, when replaceValue isn't empty
function* customGenerator(source: Buffer, replaceValue: Buffer) {
  for (let i = 0; i < source.length; i++) {
    yield replaceValue;
    yield source.slice(i, i + 1);
  }
  yield replaceValue;
}

/**
 * Returns a buffer where all instances of `searchValue` in source buffer are replaced with `replaceValue`.
 * @param {Buffer} source Source buffer
 * @param {Buffer | string} searchValue The search value. Can be either a buffer or a string.
 * @param {Buffer | string} replaceValue The replace value. Can be either a buffer or a string.
 */
export const bufferReplace = (
  source: Buffer,
  searchValue: Buffer | string,
  replaceValue: Buffer | string
): Buffer => {
  // if searchValue or replaceValue are string, convert them to buffer
  if (!Buffer.isBuffer(searchValue)) searchValue = Buffer.from(searchValue);
  if (!Buffer.isBuffer(replaceValue)) replaceValue = Buffer.from(replaceValue);

  // return if searchValue and replaceValue are empty to avoid infinite loop
  if (searchValue.length === 0 && replaceValue.length === 0) return source;

  // in case only searchValue is empty, insert replaceValue between every element
  if (searchValue.length === 0)
    return Buffer.concat([...customGenerator(source, replaceValue)]);

  // check if there's any instance of the searchValue in the buffer
  let lastIndex = source.indexOf(searchValue);
  // if there's none, return the buffer
  if (lastIndex === -1) return source;

  // variable to store the starting point of each slice
  let sliceStart = 0;
  // array to store subbuffers that'll be passed to Buffer.concat
  const subbuffers = [];

  // loop over all instances of the searchValue in the buffer
  while (lastIndex !== -1) {
    // push buffers
    subbuffers.push(source.slice(sliceStart, lastIndex));
    subbuffers.push(replaceValue);
    // store the start of next slice
    sliceStart = lastIndex + searchValue.length;
    // check for another instance of the searchValue
    lastIndex = source.indexOf(searchValue, sliceStart);
  }

  // push the remaining part of the buffer
  subbuffers.push(source.slice(sliceStart));

  // create and return new buffer
  return Buffer.concat(subbuffers);
};

/**
 * Returns a transform stream that will replace all instances of `searchValue` found in stream with `replaceValue`.
 * @param {Buffer | string} searchValue The search value. Can be either a buffer or a string.
 * @param {Buffer | string} replaceValue The replace value. Can be either a buffer or a string.
 */
export const streamReplace = (
  searchValue: Buffer | string,
  replaceValue: Buffer | string
): Transform => {
  // if searchValue or replaceValue are string, convert them to buffer
  if (!Buffer.isBuffer(searchValue)) searchValue = Buffer.from(searchValue);
  if (!Buffer.isBuffer(replaceValue)) replaceValue = Buffer.from(replaceValue);
  // temporary buffer to be used by the stream from a closure
  let tmp = Buffer.alloc(0);

  return new Transform({
    transform(chunk: any, encoding: BufferEncoding, done: TransformCallback) {
      // make sure we're working with a buffer
      let current: Buffer;
      // we're be joining tmp buffer with current chunk to check
      // if searchValue is present in-between chunks
      if (Buffer.isBuffer(chunk)) current = Buffer.concat([tmp, chunk]);
      else if (typeof chunk === "string")
        current = Buffer.concat([tmp, Buffer.from(chunk)]);
      else throw new Error("Chunk must be either a buffer or a string.");

      // try to replace values in current buffer
      const replaced = bufferReplace(current, searchValue, replaceValue);

      // push replaced value except last bytes of length equal to the search value - 1
      // if the second argument will be negative, an empty buffer will be pushed
      this.push(
        replaced.slice(0, replaced.length - searchValue.length - 1),
        encoding
      );
      // store last bytes in tmp variable to be checked during next call
      // if first argument is negative, the whole buffer will be stored
      tmp = replaced.slice(replaced.length - searchValue.length - 1);

      done();
    },
    flush(done: TransformCallback) {
      // we need to push here the remaining data in tmp buffer
      this.push(tmp);
      done();
    },
  });
};

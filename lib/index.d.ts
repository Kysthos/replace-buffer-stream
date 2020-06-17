/// <reference types="node" />
import { Transform } from "stream";
/**
 * Returns a buffer where all instances of `searchValue` in source buffer are replaced with `replaceValue`.
 * @param {Buffer} source Source buffer
 * @param {Buffer | string} searchValue The search value. Can be either a buffer or a string.
 * @param {Buffer | string} replaceValue The replace value. Can be either a buffer or a string.
 */
export declare const bufferReplace: (source: Buffer, searchValue: Buffer | string, replaceValue: Buffer | string) => Buffer;
/**
 * Returns a transform stream that will replace all instances of `searchValue` found in stream with `replaceValue`.
 * @param {Buffer | string} searchValue The search value. Can be either a buffer or a string.
 * @param {Buffer | string} replaceValue The replace value. Can be either a buffer or a string.
 */
export declare const streamReplace: (searchValue: Buffer | string, replaceValue: Buffer | string) => Transform;

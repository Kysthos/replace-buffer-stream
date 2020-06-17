"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamReplace = exports.bufferReplace = void 0;
var stream_1 = require("stream");
// a helper generator in case an empty searchValue would be passed
// to bufferReplace function, when replaceValue isn't empty
function customGenerator(source, replaceValue) {
    var i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < source.length)) return [3 /*break*/, 5];
                return [4 /*yield*/, replaceValue];
            case 2:
                _a.sent();
                return [4 /*yield*/, source.slice(i, i + 1)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                i++;
                return [3 /*break*/, 1];
            case 5: return [4 /*yield*/, replaceValue];
            case 6:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
/**
 * Returns a buffer where all instances of `searchValue` in source buffer are replaced with `replaceValue`.
 * @param {Buffer} source Source buffer
 * @param {Buffer | string} searchValue The search value. Can be either a buffer or a string.
 * @param {Buffer | string} replaceValue The replace value. Can be either a buffer or a string.
 */
exports.bufferReplace = function (source, searchValue, replaceValue) {
    // if searchValue or replaceValue are string, convert them to buffer
    if (!Buffer.isBuffer(searchValue))
        searchValue = Buffer.from(searchValue);
    if (!Buffer.isBuffer(replaceValue))
        replaceValue = Buffer.from(replaceValue);
    // return if searchValue and replaceValue are empty to avoid infinite loop
    if (searchValue.length === 0 && replaceValue.length === 0)
        return source;
    // in case only searchValue is empty, insert replaceValue between every element
    if (searchValue.length === 0)
        return Buffer.concat(__spread(customGenerator(source, replaceValue)));
    // check if there's any instance of the searchValue in the buffer
    var lastIndex = source.indexOf(searchValue);
    // if there's none, return the buffer
    if (lastIndex === -1)
        return source;
    // variable to store the starting point of each slice
    var sliceStart = 0;
    // array to store subbuffers that'll be passed to Buffer.concat
    var subbuffers = [];
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
exports.streamReplace = function (searchValue, replaceValue) {
    // if searchValue or replaceValue are string, convert them to buffer
    if (!Buffer.isBuffer(searchValue))
        searchValue = Buffer.from(searchValue);
    if (!Buffer.isBuffer(replaceValue))
        replaceValue = Buffer.from(replaceValue);
    // temporary buffer to be used by the stream from a closure
    var tmp = Buffer.alloc(0);
    return new stream_1.Transform({
        transform: function (chunk, encoding, done) {
            // make sure we're working with a buffer
            var current;
            // we're be joining tmp buffer with current chunk to check
            // if searchValue is present in-between chunks
            if (Buffer.isBuffer(chunk))
                current = Buffer.concat([tmp, chunk]);
            else if (typeof chunk === "string")
                current = Buffer.concat([tmp, Buffer.from(chunk)]);
            else
                throw new Error("Chunk must be either a buffer or a string.");
            // try to replace values in current buffer
            var replaced = exports.bufferReplace(current, searchValue, replaceValue);
            // push replaced value except last bytes of length equal to the search value - 1
            // if the second argument will be negative, an empty buffer will be pushed
            this.push(replaced.slice(0, replaced.length - searchValue.length - 1), encoding);
            // store last bytes in tmp variable to be checked during next call
            // if first argument is negative, the whole buffer will be stored
            tmp = replaced.slice(replaced.length - searchValue.length - 1);
            done();
        },
        flush: function (done) {
            // we need to push here the remaining data in tmp buffer
            this.push(tmp);
            done();
        },
    });
};

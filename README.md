## Just an excersise in streams and buffers.

Probably more tests should be written. Not sure if works in all cases. Probably not.

---

<a name="bufferReplace"></a>

## bufferReplace(source, searchValue, replaceValue)
Returns a buffer where all instances of `searchValue` in source buffer are replaced with `replaceValue`.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>Buffer</code> | Source buffer |
| searchValue | <code>Buffer</code> \| <code>string</code> | The search value. Can be either a buffer or a string. |
| replaceValue | <code>Buffer</code> \| <code>string</code> | The replace value. Can be either a buffer or a string. |

<a name="streamReplace"></a>

## streamReplace(searchValue, replaceValue)
Returns a transform stream that will replace all instances of `searchValue` found in stream with `replaceValue`.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| searchValue | <code>Buffer</code> \| <code>string</code> | The search value. Can be either a buffer or a string. |
| replaceValue | <code>Buffer</code> \| <code>string</code> | The replace value. Can be either a buffer or a string. |


---

## Examples

```js
const { streamReplace, bufferReplace } = require(".");
const { pipeline, Readable } = require("stream");

const buff = Buffer.from("some fancy text");
const searchValue = Buffer.from("fancy"); // this could be a string as well
const replaceValue = Buffer.from("regular"); // this could be a string as well

const changedBuff = bufferReplace(buff, searchValue, replaceValue);
console.log(changedBuff.toString()); // outputs: some regular text

// this will output "some regular text" as well
pipeline(
  Readable.from(buff),
  streamReplace(searchValue, replaceValue),
  process.stdout,
  (err) => {
    if (err) console.error(err);
  }
);
```
---
nav: "PropertyOptionsMetadataFunction"
note: "This file is autogenerated from TypeScript definitions. Make edits to the comments in the TypeScript file and then run `make docs` to regenerate this file."
search:
  boost: 0.1
---
# Type alias: PropertyOptionsMetadataFunction<ResultT\>

[core](../modules/core.md).PropertyOptionsMetadataFunction

Ƭ **PropertyOptionsMetadataFunction**<`ResultT`\>: (`context`: [`PropertyOptionsExecutionContext`](../interfaces/core.PropertyOptionsExecutionContext.md)) => `Promise`<[`PropertyOptionsMetadataResult`](core.PropertyOptionsMetadataResult.md)<`ResultT`\>\> \| [`PropertyOptionsMetadataResult`](core.PropertyOptionsMetadataResult.md)<`ResultT`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ResultT` | extends [`PackFormulaResult`](core.PackFormulaResult.md)[] |

#### Type declaration

▸ (`context`): `Promise`<[`PropertyOptionsMetadataResult`](core.PropertyOptionsMetadataResult.md)<`ResultT`\>\> \| [`PropertyOptionsMetadataResult`](core.PropertyOptionsMetadataResult.md)<`ResultT`\>

A JavaScript function for property options.

##### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`PropertyOptionsExecutionContext`](../interfaces/core.PropertyOptionsExecutionContext.md) |

##### Returns

`Promise`<[`PropertyOptionsMetadataResult`](core.PropertyOptionsMetadataResult.md)<`ResultT`\>\> \| [`PropertyOptionsMetadataResult`](core.PropertyOptionsMetadataResult.md)<`ResultT`\>

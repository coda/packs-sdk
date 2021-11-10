# Function: generateSchema

▸ **generateSchema**(`obj`): [`Schema`](../types/Schema.md)

Utility that examines a JavaScript value and attempts to infer a schema definition
that describes it.

It is vastly preferable to define a schema manually. A clear and accurate schema is one of the
fundamentals of a good pack. However, for data that is truly dynamic for which a schema can't
be known in advance nor can a function be written to generate a dynamic schema from other
inputs, it may be useful to us this helper to sniff the return value and generate a basic
inferred schema from it.

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `ValidTypes` |

#### Returns

[`Schema`](../types/Schema.md)

#### Defined in

[schema.ts:716](https://github.com/coda/packs-sdk/blob/main/schema.ts#L716)

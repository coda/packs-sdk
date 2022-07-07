---
title: "generateSchema"
---
# Function: generateSchema

[core](../modules/core.md).generateSchema

▸ **generateSchema**(`obj`): [`Schema`](../types/core.Schema.md)

Utility that examines a JavaScript value and attempts to infer a schema definition
that describes it.

It is vastly preferable to define a schema manually. A clear and accurate schema is one of the
fundamentals of a good pack. However, for data that is truly dynamic for which a schema can't
be known in advance nor can a function be written to generate a dynamic schema from other
inputs, it may be useful to us this helper to sniff the return value and generate a basic
inferred schema from it.

This utility does NOT attempt to determine [ObjectSchemaDefinition.idProperty](../interfaces/core.ObjectSchemaDefinition.md#idproperty) or
[ObjectSchemaDefinition.displayProperty](../interfaces/core.ObjectSchemaDefinition.md#displayproperty) attributes for
an object schema, those are left undefined.

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | [`InferrableTypes`](../types/core.InferrableTypes.md) |

#### Returns

[`Schema`](../types/core.Schema.md)

#### Defined in

[schema.ts:1102](https://github.com/coda/packs-sdk/blob/main/schema.ts#L1102)

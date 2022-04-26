---
title: "makeFormula"
---
# Function: makeFormula

▸ **makeFormula**<`ParamDefsT`, `ResultT`, `SchemaT`\>(`fullDefinition`): [`Formula`](../types/Formula.md)<`ParamDefsT`, `ResultT`, `SchemaT`\>

Creates a formula definition.

You must indicate the kind of value that this formula returns (string, number, boolean, array, or object)
using the `resultType` field.

Formulas always return basic types, but you may optionally give a type hint using
`codaType` to tell Coda how to interpret a given value. For example, you can return
a string that represents a date, but use `codaType: ValueType.Date` to tell Coda
to interpret as a date in a document.

If your formula returns an object, you must provide a `schema` property that describes
the structure of the object. See [makeObjectSchema](makeObjectSchema.md) for how to construct an object schema.

If your formula returns a list (array), you must provide an `items` property that describes
what the elements of the array are. This could be a simple schema like `{type: ValueType.String}`
indicating that the array elements are all just strings, or it could be an object schema
created using [makeObjectSchema](makeObjectSchema.md) if the elements are objects.

**`example`**
```
makeFormula({resultType: ValueType.String, name: 'Hello', ...});
```

**`example`**
```
makeFormula({resultType: ValueType.String, codaType: ValueType.Html, name: 'HelloHtml', ...});
```

**`example`**
```
makeFormula({resultType: ValueType.Array, items: {type: ValueType.String}, name: 'HelloStringArray', ...});
```

**`example`**
```
makeFormula({
  resultType: ValueType.Object,
  schema: makeObjectSchema({type: ValueType.Object, properties: {...}}),
  name: 'HelloObject',
  ...
});
```

**`example`**
```
makeFormula({
  resultType: ValueType.Array,
  items: makeObjectSchema({type: ValueType.Object, properties: {...}}),
  name: 'HelloObjectArray',
  ...
});
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](../types/ParamDefs.md) |
| `ResultT` | extends [`ValueType`](../enums/ValueType.md) |
| `SchemaT` | extends [`Schema`](../types/Schema.md) = [`Schema`](../types/Schema.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `fullDefinition` | [`FormulaDefinition`](../types/FormulaDefinition.md)<`ParamDefsT`, `ResultT`, `SchemaT`\> |

#### Returns

[`Formula`](../types/Formula.md)<`ParamDefsT`, `ResultT`, `SchemaT`\>

#### Defined in

[api.ts:773](https://github.com/coda/packs-sdk/blob/main/api.ts#L773)

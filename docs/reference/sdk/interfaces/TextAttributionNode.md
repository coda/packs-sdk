---
title: "TextAttributionNode"
---
# Interface: TextAttributionNode

An attribution node that simply renders some text.

This might be used to attribute the data source.

**`example`**
```
coda.makeAttributionNode({
  type: coda.AttributionNodeType.Text,
  text: "Data provided by ExampleCorp.",
});
```

## Properties

### text

• **text**: `string`

The text to render with the pack value.

#### Defined in

[schema.ts:885](https://github.com/coda/packs-sdk/blob/main/schema.ts#L885)

___

### type

• **type**: [`Text`](../enums/AttributionNodeType.md#text)

Identifies this as a text attribution node.

#### Defined in

[schema.ts:883](https://github.com/coda/packs-sdk/blob/main/schema.ts#L883)

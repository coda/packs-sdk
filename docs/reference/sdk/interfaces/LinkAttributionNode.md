---
title: "LinkAttributionNode"
---
# Interface: LinkAttributionNode

An attribution node that renders a hyperlink.

This might be used to attribute the data source and link back to the home page
of the data source or directly to the source data.

**`example`**
```
coda.makeAttributionNode({
  type: coda.AttributionNodeType.Link,
  anchorUrl: "https://example.com",
  anchorText: "Data provided by ExampleCorp.",
});
```

## Properties

### anchorText

• **anchorText**: `string`

The text of the hyperlink.

#### Defined in

[schema.ts:907](https://github.com/coda/packs-sdk/blob/main/schema.ts#L907)

___

### anchorUrl

• **anchorUrl**: `string`

The URL to link to.

#### Defined in

[schema.ts:905](https://github.com/coda/packs-sdk/blob/main/schema.ts#L905)

___

### type

• **type**: [`Link`](../enums/AttributionNodeType.md#link)

Identifies this as a link attribution node.

#### Defined in

[schema.ts:903](https://github.com/coda/packs-sdk/blob/main/schema.ts#L903)

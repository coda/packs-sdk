---
title: LinkAttributionNode
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

[schema.ts:771](https://github.com/coda/packs-sdk/blob/main/schema.ts#L771)

___

### anchorUrl

• **anchorUrl**: `string`

The URL to link to.

#### Defined in

[schema.ts:769](https://github.com/coda/packs-sdk/blob/main/schema.ts#L769)

___

### type

• **type**: [`Link`](../enums/AttributionNodeType.md#link)

Identifies this as a link attribution node.

#### Defined in

[schema.ts:767](https://github.com/coda/packs-sdk/blob/main/schema.ts#L767)

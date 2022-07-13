---
title: "LinkAttributionNode"
---
# Interface: LinkAttributionNode

[core](../modules/core.md).LinkAttributionNode

An attribution node that renders a hyperlink.

This might be used to attribute the data source and link back to the home page
of the data source or directly to the source data.

**`Example`**

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

[schema.ts:998](https://github.com/coda/packs-sdk/blob/main/schema.ts#L998)

___

### anchorUrl

• **anchorUrl**: `string`

The URL to link to.

#### Defined in

[schema.ts:996](https://github.com/coda/packs-sdk/blob/main/schema.ts#L996)

___

### type

• **type**: [`Link`](../enums/core.AttributionNodeType.md#link)

Identifies this as a link attribution node.

#### Defined in

[schema.ts:994](https://github.com/coda/packs-sdk/blob/main/schema.ts#L994)

---
nav: "ImageAttributionNode"
---
# Interface: ImageAttributionNode

[core](../modules/core.md).ImageAttributionNode

An attribution node that renders as a hyperlinked image.

This is often the logo of the data source along with a link back to the home page
of the data source or directly to the source data.

**`Example`**

```
coda.makeAttributionNode({
  type: coda.AttributionNodeType.Image,
  anchorUrl: "https://example.com",
  imageUrl: "https://example.com/assets/logo.png",
});
```

## Properties

### anchorUrl

• **anchorUrl**: `string`

The URL to link to.

#### Defined in

[schema.ts:1092](https://github.com/coda/packs-sdk/blob/main/schema.ts#L1092)

___

### imageUrl

• **imageUrl**: `string`

The URL of the image to render.

#### Defined in

[schema.ts:1094](https://github.com/coda/packs-sdk/blob/main/schema.ts#L1094)

___

### type

• **type**: [`Image`](../enums/core.AttributionNodeType.md#image)

Identifies this as an image attribution node.

#### Defined in

[schema.ts:1090](https://github.com/coda/packs-sdk/blob/main/schema.ts#L1090)

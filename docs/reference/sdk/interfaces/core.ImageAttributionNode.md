---
title: "ImageAttributionNode"
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

[schema.ts:987](https://github.com/coda/packs-sdk/blob/main/schema.ts#L987)

___

### imageUrl

• **imageUrl**: `string`

The URL of the image to render.

#### Defined in

[schema.ts:989](https://github.com/coda/packs-sdk/blob/main/schema.ts#L989)

___

### type

• **type**: [`Image`](../enums/core.AttributionNodeType.md#image)

Identifies this as an image attribution node.

#### Defined in

[schema.ts:985](https://github.com/coda/packs-sdk/blob/main/schema.ts#L985)

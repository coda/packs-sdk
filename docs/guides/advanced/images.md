---
title: Images & files
---

# Working with images and files

You can upload images and files to a Coda doc, including in a table using dedicated column types. Packs likewise have the ability to work with binary data.

[View Sample Code][samples]{ .md-button }


## Parameters and result types

Formulas can accept an image as a parameter using the parameter type `Image`, which is then passed to the `execute` function as a URL. Likewise, formulas can return images as URLs, using the hint type `ImageReference` or `ImageAttachment`. When using an image reference the image is always loaded from the source URL, while for attachments Coda copies the image from the source URL into the document and shows that local copy.

Image attachments should be used in most cases. An image reference may make more sense if you expect the image to be updated often and want to ensure the doc is always using the latest copy, or when contractually obligated to hotlink to the image.

Files work very much the same as images, with the `File` parameter type and for input and the `Attachment` value hint for output.

See the [Parameters][parameters_images] and [Data types][data_types_images] guides for more information.


## Expiring images {: #expiring}

Some APIs provide access to images using URLs that expire after a short amount of time. In these cases, return the URL with the hint type `ImageAttachment`, which instructs Coda to ingest the image and store a copy in the document.

Ingesting an image can take a few seconds, and Coda will show a paperclip icon for the image until it is complete. This delay can be more noticeable for sync tables, since they can return many images at once and they are ingested sequentially.

!!! bug
    Image attachments currently only work correctly within a sync table. When used outside of a sync table they behave like image references and load the image from the source URL.


## Private images {: #private}

Some APIs return links to private images, that require authentication credentials to be provided in order to access their content. Before Coda can ingest these images you must first copy them to a location that is publicly accessible. The Pack SDK provides a utility for this, known as [`TemporaryBlobStorage`][reference_temporaryblobstorage]. It is made available at `context.temporaryBlobStorage`, and the `storeUrl()` method fetches the image (with authentication credentials), stores the data in a temporary location, and returns the resulting URL. This temporary URL can then be returned as an `ImageAttachment` as [discussed above](#expiring).

```ts
let privateImageUrl = response.body.imageUrl;
let temporaryImageUrl =
  await context.temporaryBlobStorage.storeUrl(privateImageUrl);
return temporaryImageUrl;
```


## Raw image data

Some APIs return the raw image data directly in the response object, typically as a base64-encoded string. Additionally, JavaScript libraries used to generate or manipulate images may also return raw image data.

Similar to [private images](#private) discussed above, you can use `TemporaryBlobStorage` to store the image data in a temporary location and get a URL which Coda can then ingest. The `storeBlob()` method accepts a [Node.js `Buffer`][buffer] containing the data and the content type of the image.

```ts
let imageBase64 = response.body.image;
let buffer = Buffer.from(imageBase64, "base64");
let temporaryImageUrl =
  await context.temporaryBlobStorage.storeBlob(buffer, "image/png");
return temporaryImageUrl;
```


## SVG images

[Scalable Vector Graphics (SVG)][mdn_svg] is an XML-based markup language for drawing images, and Packs can generate SVGs to create custom visualizations. For example, the [Latex Pack][pack_latex] uses a JavaScript library to generate SVG images of math equations.

Instead of storing SVG images in temporary blob storage, you can instead encode them to a base64 string and return them as a [Data URL][mdn_data_urls]

```ts
let svg = "...";
let encoded = Buffer.from(svg).toString("base64");
return coda.SvgConstants.DataUrlPrefix + encoded;
```

!!! danger "Data URL Size"
    Data URLs should only be used for very small images, like simple SVGs. Returning large images as data URLs can cause performance issues or even break the document they are used in.


### Dark mode

You may want to adjust the colors of your generated SVG based on whether the user has dark mode enabled. To accomplish this:

1.  Assign an `id` to the root element of your SVG, using the value provided in `coda.SvgConstants.DarkModeFragmentId`.
1.  Create a CSS style rule for that element and the [CSS `:target` selector][mdn_target], that applies the dark mode styling changes.
1.  Return the SVG using the `coda.SvgConstants.DataUrlPrefixWithDarkModeSupport` prefix.

```ts
let darkModeId = coda.SvgConstants.DarkModeFragmentId;
let svg = `
  <svg ...>
    <g id="${darkModeId}">
      ...
    </g>
    <style>
      #${darkModeId}:target { ... }
    </style>
  </svg>
`.trim();
let encoded = Buffer.from(svg).toString("base64");
return coda.SvgConstants.DataUrlPrefixWithDarkModeSupport + encoded;
```



[samples]: ../../samples/topic/image.md
[parameters_images]: ../basics/parameters/index.md#images
[data_types_images]: ../basics/data-types.md#images
[reference_temporaryblobstorage]: ../../reference/sdk/interfaces/core.TemporaryBlobStorage.md
[buffer]: https://nodejs.org/en/knowledge/advanced/buffers/how-to-use-buffers/
[mdn_data_urls]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
[mdn_svg]: https://developer.mozilla.org/en-US/docs/Web/SVG
[pack_latex]: https://coda.io/packs/latex-1058
[mdn_target]: https://developer.mozilla.org/en-US/docs/Web/CSS/:target

---
nav: Images & files
description: Use images and files as parameters and return types.
---

# Working with images and files

You can upload images and files to a doc, including in a table using dedicated column types. Packs likewise have the ability to work with binary data.

[View Sample Code][samples]{ .md-button }


## Parameters and result types

Formulas can accept an image as a parameter using the parameter type `Image`, which is then passed to the `execute` function as a URL. Likewise, formulas can return images as URLs, using the hint type `ImageReference` or `ImageAttachment`. When using an image reference the image is always loaded from the source URL, while for attachments Superhuman Docs copies the image from the source URL into the document and shows that local copy.

Image attachments should be used in most cases. An image reference may make more sense if you expect the image to be updated often and want to ensure the doc is always using the latest copy, or when contractually obligated to hotlink to the image.

Files work very much the same as images, with the `File` parameter type and for input and the `Attachment` value hint for output.

See the [Parameters][parameters_images] and [Data types][data_types_images] guides for more information.


## Expiring images {: #expiring}

Some APIs provide access to images using URLs that expire after a short amount of time. In these cases, return the URL with the hint type `ImageAttachment`, which instructs Superhuman Docs to ingest the image and store a copy in the document.

Ingesting an image can take a few seconds, and Superhuman Docs will show a paperclip icon for the image until it is complete. This delay can be more noticeable for sync tables, since they can return many images at once and they are ingested sequentially.

!!! bug
    Image attachments currently only work correctly within a sync table. When used outside of a sync table they behave like image references and load the image from the source URL.


## Private images {: #private}

Some APIs return links to private images, that require authentication credentials to be provided in order to access their content. Before Superhuman Docs can ingest these images you must first copy them to a location that is publicly accessible. The Pack SDK provides a utility for this, known as [`TemporaryBlobStorage`][reference_temporaryblobstorage]. It is made available at `context.temporaryBlobStorage`, and the `storeUrl()` method fetches the image (with authentication credentials), stores the data in a temporary location, and returns the resulting URL. This temporary URL can then be returned as an `ImageAttachment` as [discussed above](#expiring).

```ts
let privateImageUrl = response.body.imageUrl;
let temporaryImageUrl =
  await context.temporaryBlobStorage.storeUrl(privateImageUrl);
return temporaryImageUrl;
```


## Raw image data

Some APIs return the raw image data directly in the response object, typically as a base64-encoded string. Additionally, JavaScript libraries used to generate or manipulate images may also return raw image data.

Similar to [private images](#private) discussed above, you can use `TemporaryBlobStorage` to store the image data in a temporary location and get a URL which Superhuman Docs can then ingest. The `storeBlob()` method accepts a [Node.js `Buffer`][buffer] containing the data and the content type of the image.

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
return sdk.SvgConstants.DataUrlPrefix + encoded;
```

Data URLs should only be used for very small images, like simple SVGs. Using this approach for large images can lead to issues.

- **:superhuman-go: Go** - A data URL is passed to the LLM, which has to reproduce it character-for-character when writing its response. LLMs often can't faithfully copy long base64 strings, resulting in a broken image.
- **:superhuman-docs: Docs** - The URL data is stored in the document model, and large URLs can lead to performance issues or even break the document.

For large images, return a hosted URL instead, for example from [temporary blob storage](#raw-image-data).


### Dark mode

You may want to adjust the colors of your generated SVG based on whether the user has dark mode enabled. To accomplish this:

1.  Assign an `id` to the root element of your SVG, using the value provided in `sdk.SvgConstants.DarkModeFragmentId`.
1.  Create a CSS style rule for that element and the [CSS `:target` selector][mdn_target], that applies the dark mode styling changes.
1.  Return the SVG using the `sdk.SvgConstants.DataUrlPrefixWithDarkModeSupport` prefix.

```ts
let darkModeId = sdk.SvgConstants.DarkModeFragmentId;
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
return sdk.SvgConstants.DataUrlPrefixWithDarkModeSupport + encoded;
```


## Images in chat {: #chat}

!!! info "Superhuman Go only"

    These image rendering rules only apply to connectors installed in :superhuman-go: Go.

Chat replies can include images, which will be automatically scaled to fit the width of the side panel.

<img src="site:images/agent_image.png" srcset="site:images/agent_image_2x.png 2x" alt="A screenshot of chat response containing an image." class="screenshot">

For security reasons, images will only be rendered if the URL is either:

- Returned by a formula and annotated as an image.
- Hosted on one of the declared network domains.
- A data URI (starts with the `data:` scheme).

See the sections below to learn more.


### Annotated formula result

When using a formula as a tool, ensure any image URLs returned are correctly annotated with either the [`ImageAttachment`][hinttype_imageattachment] or [`ImageReference`][hinttype_imagereference] hint. This is done by specifying the `codaType` of the formula or schema property.

=== "Returning an image"

    ```{.ts hl_lines="9"}
    import * as sdk from "@codahq/packs-sdk";
    export const pack = sdk.newPack();

    pack.addFormula({
      name: "DogPhoto",
      description: "Gets a random photo of a dog.",
      parameters: [],
      resultType: sdk.ValueType.String,
      codaType: sdk.ValueHintType.ImageReference,
      cacheTtlSecs: 0,
      execute: async function (args, context) {
        let response = await context.fetcher.fetch({
          method: "GET",
          url: "https://dog.ceo/api/breeds/image/random",
          cacheTtlSecs: 0,
        });
        return response.body.message;
      },
    });
    ```

=== "Returning a schema"

    ```{.ts hl_lines="9"}
    import * as sdk from "@codahq/packs-sdk";
    export const pack = sdk.newPack();

    const PokemonSchema = sdk.makeObjectSchema({
      properties: {
        name: { type: sdk.ValueType.String },
        sprite: {
          type: sdk.ValueType.String,
          codaType: sdk.ValueHintType.ImageReference,
        },
      },
      displayProperty: "name",
    });

    pack.addFormula({
      name: "Pokemon",
      description: "Gets information about a Pokemon.",
      parameters: [
        sdk.makeParameter({
          type: sdk.ParameterType.String,
          name: "nameOrId",
          description: "The name or ID of the Pokemon to lookup.",
        }),
      ],
      resultType: sdk.ValueType.Object,
      schema: PokemonSchema,
      execute: async function (args, context) {
        let [nameOrId] = args;
        let response = await context.fetcher.fetch({
          method: "GET",
          url: `https://pokeapi.co/api/v2/pokemon/${nameOrId}`,
        });
        let data = response.body;
        return {
          ...data,
          sprite: data.sprites.front_default,
        };
      },
    });
    ```

!!! info "Images scanned and served by Superhuman"

    Images annotated this way will not be served directly; instead, they will be uploaded to Superhuman's CDN. As part of that process, they will undergo a security scan and may be rejected if deemed dangerous.


### Matching network domain {:#image-network-domain}

There are times when it isn't possible to annotate images in tool responses:

- A formula is returning image URLs embedded in either `Html` or `Markdown` text.
- An MCP tool is returning an image.

In these cases, you'll need to ensure that the domain of the image matches one of the declared [network domains][network_domains], or is a subdomain of one of them.

Some apps host images on a CDN at a separate domain; in that case, you'll need to declare multiple domains, which [requires approval][support_approvals]. If your connector uses authentication, you'll also need to specify which domains to send credentials to via the `networkDomain` field.

```{.ts hl_lines="12-14 19-20"}
import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

pack.addMCPServer({
  name: "GitHub",
  endpointUrl: "https://api.githubcopilot.com/mcp/",
});

// Register the domain where the MCP server is hosted.
pack.addNetworkDomain("githubcopilot.com");

// Register additional domains where images are hosted.
pack.addNetworkDomain("github.com");
pack.addNetworkDomain("githubusercontent.com");

pack.setUserAuthentication({
  type: sdk.AuthenticationType.HeaderBearerToken,
  instructionsUrl: "https://github.com/settings/tokens",
  // Only send credentials to the MCP server.
  networkDomain: ["githubcopilot.com"]
});
```


### Data URI

Images that aren't hosted on the web but are embedded in the image URL can be displayed without additional configuration. These URLs start with the `data:` scheme, and typically contain the image as a base64-encoded string.

```txt title="Example Data URI"
data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgLz48L3N2Zz4=
```



[samples]: ../../samples/topic/image.md
[parameters_images]: ../basics/parameters/index.md#images
[data_types_images]: ../basics/data-types.md#images
[reference_temporaryblobstorage]: ../../reference/sdk/core/interfaces/TemporaryBlobStorage.md
[hinttype_imageattachment]: ../../reference/sdk/core/enumerations/ValueHintType.md#imageattachment
[hinttype_imagereference]: ../../reference/sdk/core/enumerations/ValueHintType.md#imagereference
[network_domains]: ../basics/fetcher.md#network-domains
[support_approvals]: ../../support/index.md#approvals
[buffer]: https://nodejs.org/api/buffer.html#buffer
[mdn_data_urls]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
[mdn_svg]: https://developer.mozilla.org/en-US/docs/Web/SVG
[pack_latex]: https://coda.io/packs/latex-1058
[mdn_target]: https://developer.mozilla.org/en-US/docs/Web/CSS/:target

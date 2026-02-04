---
nav: Fetcher
description: Samples that show how to fetch data from an external source.
icon: fontawesome/solid/cloud-arrow-down
---

# Fetcher samples

Communicating with an API or external server is done through the `Fetcher`, a custom interface for making HTTP requests. The fetcher is made available through the `context` object passed in to formulas. The fetcher can only send requests to URLs that have a domain name that's been registered using `addNetworkDomain`. The fetcher runs asynchronously, and is typically run within an `async` function that will `await` the result.


[Learn More](../../guides/basics/fetcher.md){ .md-button }

## Template (GET)
The basic structure of a GET request.

```ts
{% raw %}
let response = await context.fetcher.fetch({
  method: "GET",
  url: "https://example.com",
});
let data = response.body;
{% endraw %}
```
## Template (POST)
The basic structure of a JSON POST request.

```ts
{% raw %}
let payload = {
  // TODO: Construct the JSON that the API expects.
};
let response = await context.fetcher.fetch({
  method: "POST",
  url: "https://example.com",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});
let data = response.body;
{% endraw %}
```
## Fetch JSON
A formula that gets a JSON value. This sample generates random bacon-themed Lorem Ipsum text.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// When using the fetcher, this is the domain of the API that your pack makes
// fetcher requests to.
pack.addNetworkDomain("baconipsum.com");

// This line adds a new formula to this Pack.
pack.addFormula({
  name: "BaconIpsum",
  description: "Returns meat-themed lorem ipsum copy.",
  parameters: [], // No parameters required.
  resultType: coda.ValueType.String,

  // This function is declared async to that is can wait for the fetcher to
  // complete. The context parameter provides access to the fetcher.
  execute: async function ([], context) {
    let url = "https://baconipsum.com/api/?type=meat-and-filler";

    // The fetcher's fetch method makes the request. The await keyword is used
    // to wait for the API's response before continuing on through the code.
    let response = await context.fetcher.fetch({
      method: "GET",
      url: url,
    });

    // The API returns an array of strings, which is automatically parsed by
    // the fetcher into a JavaScript object.
    let paragraphs = response.body;

    // Return the paragraphs separated by a blank line.
    return paragraphs.join("\n\n");
  },
});
{% endraw %}
```
## Fetch binary data
A formula that fetches binary data. This sample gets image data and calculates the file size.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Regular expression that matches Coda-hosted images.
const HostedImageUrlRegex = new RegExp("^https://(?:[^/]*\.)?codahosted.io/.*");

// Formula that calculates the file size of an image.
pack.addFormula({
  name: "FileSize",
  description: "Gets the file size of an image, in bytes.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Image,
      name: "image",
      description:
        "The image to operate on. Not compatible with Image URL columns.",
    }),
  ],
  resultType: coda.ValueType.Number,
  execute: async function ([imageUrl], context) {
    // Throw an error if the image isn't Coda-hosted. Image URL columns can
    // contain images on any domain, but by default Packs can only access image
    // attachments hosted on codahosted.io.
    if (!imageUrl.match(HostedImageUrlRegex)) {
      throw new coda.UserVisibleError("Not compatible with Image URL columns.");
    }
    // Fetch the image content.
    let response = await context.fetcher.fetch({
      method: "GET",
      url: imageUrl,
      isBinaryResponse: true, // Required when fetching binary content.
    });
    // The binary content of the response is returned as a Node.js Buffer.
    // See: https://nodejs.org/api/buffer.html
    let buffer = response.body as Buffer;
    // Return the length, in bytes.
    return buffer.length;
  },
});
{% endraw %}
```
## GraphQL query
A sync table that queries a GraphQL API. This sample lists the products in a mock online store.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

const PageSize = 20;
const OneDaySecs = 24 * 60 * 60;

const ProductSchema = coda.makeObjectSchema({
  properties: {
    name: {
      type: coda.ValueType.String,
      fromKey: "title",
    },
    description: { type: coda.ValueType.String },
    image: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.ImageAttachment,
    },
    link: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
      fromKey: "onlineStoreUrl",
    },
    id: { type: coda.ValueType.String },
  },
  displayProperty: "name",
  idProperty: "id",
  featuredProperties: ["description", "image", "link"],
});

pack.addNetworkDomain("mock.shop");

pack.addSyncTable({
  name: "Products",
  description: "Lists the products available in the store.",
  identityName: "Product",
  schema: ProductSchema,
  formula: {
    name: "SyncProducts",
    description: "Syncs the data.",
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "name",
        description: "If specified, only matching products will be included.",
        optional: true,
      }),
    ],
    execute: async function (args, context) {
      let [name] = args;
      let cursor = context.sync.continuation?.cursor;

      let filters = [
        `first: ${PageSize}`,
      ];
      if (name) {
        filters.push(`query: "title:${name}"`);
      }
      if (cursor) {
        filters.push(`after: "${cursor}"`);
      }

      let payload = {
        query: `{
          products(${filters.join(" ")}) {
            edges {
              cursor
              node {
                id
                title
                description
                onlineStoreUrl
                featuredImage {
                  url
                }
              }
            }
          }
        }
        `,
      };
      let response = await context.fetcher.fetch({
        method: "POST",
        url: "https://mock.shop/api",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        // Force caching of a POST response.
        forceCache: true,
        cacheTtlSecs: OneDaySecs,
      });
      let edges = response.body.data.products.edges;

      let products = edges.map(edge => edge.node);
      for (let product of products) {
        product.image = product.featuredImage.url;
      }

      let continuation;
      if (products.length > 0) {
        let lastCursor = edges.at(-1).cursor;
        continuation = { cursor: lastCursor };
      }

      return {
        result: products,
        continuation: continuation,
      };
    },
  },
});
{% endraw %}
```
## Send form-encoded data
An action formula that sends application/x-www-form-urlencoded data. This sample uploads an image to Imgur.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

pack.addFormula({
  name: "Upload",
  description: "Uploads an image to Imgur.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Image,
      name: "image",
      description: "The image to upload.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "title",
      description: "The title of the image.",
      optional: true,
    }),
  ],
  resultType: coda.ValueType.String,
  isAction: true,
  execute: async function (args, context) {
    let [imageUrl, title] = args;
    let response = await context.fetcher.fetch({
      method: "POST",
      url: "https://api.imgur.com/3/image",
      // Use the form field to generate a application/x-www-form-urlencoded
      // payload and set the correct headers.
      form: {
        image: imageUrl,
        type: "url",
        title: title,
      },
    });
    return response.body.data.link;
  },
});

pack.addNetworkDomain("imgur.com");

pack.setSystemAuthentication({
  type: coda.AuthenticationType.CustomHeaderToken,
  headerName: "Authentication",
  tokenPrefix: "Client-ID",
});
{% endraw %}
```


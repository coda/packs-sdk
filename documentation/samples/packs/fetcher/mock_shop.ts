import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

const PageSize = 20;
const OneDaySecs = 24 * 60 * 60;

const ProductSchema = sdk.makeObjectSchema({
  properties: {
    name: {
      type: sdk.ValueType.String,
      fromKey: "title",
    },
    description: { type: sdk.ValueType.String },
    image: {
      type: sdk.ValueType.String,
      hintType: sdk.ValueHintType.ImageAttachment,
    },
    link: {
      type: sdk.ValueType.String,
      hintType: sdk.ValueHintType.Url,
      fromKey: "onlineStoreUrl",
    },
    id: { type: sdk.ValueType.String },
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
      sdk.makeParameter({
        type: sdk.ParameterType.String,
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

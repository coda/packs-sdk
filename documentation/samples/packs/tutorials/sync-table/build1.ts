import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

pack.addNetworkDomain("gutendex.com");

const BookSchema = sdk.makeObjectSchema({
  properties: {
    title: { type: sdk.ValueType.String },
    id: { type: sdk.ValueType.Number },
  },
  displayProperty: "title",
  idProperty: "id",
});

pack.addSyncTable({
  name: "Books",
  description: "Lists books in the collection.",
  identityName: "Book",
  schema: BookSchema,
  formula: {
    name: "SyncBooks",
    description: "Syncs the books.",
    parameters: [
      sdk.makeParameter({
        type: sdk.ParameterType.String,
        name: "topic",
        description: "Limit books to this topic.",
        optional: true,
      }),
    ],
    execute: async function (args, context) {
      let [topic] = args;
      let baseUrl = "https://gutendex.com/books";
      let url = sdk.withQueryParams(baseUrl, {
        topic: topic,
      });
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
      });
      let rows = response.body.results;
      return {
        result: rows,
      };
    },
  },
});

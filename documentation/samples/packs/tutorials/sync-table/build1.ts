import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

pack.addNetworkDomain("gutendex.com");

const BookSchema = coda.makeObjectSchema({
  properties: {
    title: { type: coda.ValueType.String },
    bookId: {
      type: coda.ValueType.Number,
      fromKey: "id",
    },
  },
  displayProperty: "title",
  idProperty: "bookId",
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
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "topic",
        description: "Limit books to this topic.",
        optional: true,
      }),
    ],
    execute: async function (args, context) {
      let [topic] = args;
      let baseUrl = "https://gutendex.com/books";
      let url = coda.withQueryParams(baseUrl, {
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

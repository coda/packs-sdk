import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

pack.addNetworkDomain("gutendex.com");

const AuthorSchema = sdk.makeObjectSchema({
  properties: {
    name: { type: sdk.ValueType.String },
    born: {
      type: sdk.ValueType.Number,
      fromKey: "birth_year",
    },
    died: {
      type: sdk.ValueType.Number,
      fromKey: "death_year",
    },
  },
  displayProperty: "name",
});

const BookSchema = sdk.makeObjectSchema({
  properties: {
    title: { type: sdk.ValueType.String },
    id: { type: sdk.ValueType.Number },
    subjects: {
      type: sdk.ValueType.Array,
      items: { type: sdk.ValueType.String },
    },
    authors: {
      type: sdk.ValueType.Array,
      items: AuthorSchema,
    },
    thumbnail: {
      type: sdk.ValueType.String,
      hintType: sdk.ValueHintType.ImageAttachment,
    },
    link: {
      type: sdk.ValueType.String,
      hintType: sdk.ValueHintType.Url,
    },
  },
  displayProperty: "title",
  idProperty: "id",
  featuredProperties: [
    "authors", "subjects", "link", "thumbnail",
  ],
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
      if (context.sync.continuation) {
        url = context.sync.continuation!.url as string;
      }
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
      });
      let rows = response.body.results;
      for (let row of rows) {
        row.thumbnail = row.formats["image/jpeg"];
        row.link =
          "https://www.gutenberg.org/ebooks/" + row.id;
      }
      let continuation;
      if (response.body.next) {
        continuation = {
          url: response.body.next,
        };
      }
      return {
        result: rows,
        continuation: continuation,
      };
    },
  },
});

import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

pack.addNetworkDomain("gutendex.com");

const AuthorSchema = coda.makeObjectSchema({
  properties: {
    name: { type: coda.ValueType.String },
    born: {
      type: coda.ValueType.Number,
      fromKey: "birth_year",
    },
    died: {
      type: coda.ValueType.Number,
      fromKey: "death_year",
    },
  },
  displayProperty: "name",
});

const BookSchema = coda.makeObjectSchema({
  properties: {
    title: { type: coda.ValueType.String },
    bookId: {
      type: coda.ValueType.Number,
      fromKey: "id",
    },
    subjects: {
      type: coda.ValueType.Array,
      items: { type: coda.ValueType.String },
    },
    authors: {
      type: coda.ValueType.Array,
      items: AuthorSchema,
    },
    thumbnail: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.ImageAttachment,
    },
    link: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
    },
  },
  displayProperty: "title",
  idProperty: "bookId",
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
      for (let row of rows) {
        row.thumbnail = row.formats["image/jpeg"];
        row.link =
          "https://www.gutenberg.org/ebooks/" + row.id;
      }
      return {
        result: rows,
      };
    },
  },
});

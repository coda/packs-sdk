import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Schema for a Cat image.
const CatSchema = coda.makeObjectSchema({
  properties: {
    image: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.ImageReference,
    },
    tags: {
      type: coda.ValueType.Array,
      items: coda.makeSchema({ type: coda.ValueType.String }),
    },
    created: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.DateTime,
    },
    id: { type: coda.ValueType.String },
  },
  displayProperty: "image",
  idProperty: "id",
  featuredProperties: ["tags"],
});

// Sync table that retrieves all cat images, optionally filtered by tags.
pack.addSyncTable({
  name: "Cats",
  identityName: "Cat",
  schema: CatSchema,
  connectionRequirement: coda.ConnectionRequirement.None,
  formula: {
    name: "SyncCats",
    description: "Syncs the cats.",
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "tag",
        description: "Only cats with this tag will be selected.",
        optional: true,
        // Pull the list of tags to use for autocomplete from the API.
        autocomplete: async function (context, search) {
          let response = await context.fetcher.fetch({
            method: "GET",
            url: "https://cataas.com/api/tags",
          });
          let tags = response.body;
          // Convert the tags into a list of autocomplete options.
          return coda.simpleAutocomplete(search, tags);
        },
      }),
    ],
    execute: async function ([tag], context) {
      let url = coda.withQueryParams("https://cataas.com/api/cats", {
        tags: tag,
        limit: 10000,
      });
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
      });
      let cats = response.body;
      let result = [];
      for (let cat of cats) {
        result.push({
          image: "https://cataas.com/cat/" + cat._id,
          tags: cat.tags,
          created: cat.createdAt,
          id: cat._id,
        });
      }
      return {
        result: result,
      };
    },
  },
});

// Allow the pack to make requests to Cat-as-a-service API.
pack.addNetworkDomain("cataas.com");

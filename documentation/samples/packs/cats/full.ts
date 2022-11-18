import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

pack.addNetworkDomain("cataas.com");

// Tag parameter, shared across multiple formulas.
const TagParameter = coda.makeParameter({
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
});

// Formula that fetches a random cat image, with various options.
pack.addFormula({
  name: "CatImage",
  description: "Gets a random cat image.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "text",
      description: "Text to display over the image.",
      optional: true,
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "size",
      description: "The size of the text, in pixels.",
      optional: true,
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "color",
      description: "The color of the text. Any valid CSS color can be used.",
      optional: true,
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "width",
      description: "The width of the desired image, in pixels.",
      optional: true,
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "height",
      description: "The height of the desired image, in pixels.",
      optional: true,
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "filter",
      description: "A filter to apply to the image.",
      autocomplete: ["blur", "mono", "sepia", "negative", "paint", "pixel"],
      optional: true,
    }),
    TagParameter,
  ],
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.ImageReference,
  execute: async function (
    [text, size, color, width, height, filter, tag],
    context,
    ) {
    let url = "https://cataas.com/cat";
    if (tag) {
      url += "/" + tag;
    }
    if (text) {
      url += "/says/" + encodeURIComponent(text);
    }
    url = coda.withQueryParams(url, {
      size: size,
      color: color,
      width: width,
      height: height,
      filter: filter,
      json: true,
    });
    let response = await context.fetcher.fetch({
      method: "GET",
      url: url,
      cacheTtlSecs: 0, // Don't cache the result, so we can get a fresh cat.
    });
    return "https://cataas.com" + response.body.url;
  },
});

// Column format that displays the cell's value within a random cat image,
// using the CatImage() formula defined above.
pack.addColumnFormat({
  name: "Cat Image",
  instructions: "Displays the text over the image of a random cat.",
  formulaName: "CatImage",
});

// Schema for a Cat image.
const CatSchema = coda.makeObjectSchema({
  properties: {
    image: {
      description: "The cat image.",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.ImageReference,
    },
    tags: {
      description: "The tags used to categorize this cat.",
      type: coda.ValueType.Array,
      items: coda.makeSchema({ type: coda.ValueType.String }),
    },
    created: {
      description: "When the cat image was added.",
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
    parameters: [TagParameter],
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

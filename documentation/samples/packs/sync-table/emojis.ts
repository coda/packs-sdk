import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

const EmojiSchema = coda.makeObjectSchema({
  properties: {
    name: { type: coda.ValueType.String, fromKey: "annotation" },
    hexcode: { type: coda.ValueType.String },
    emoji: { type: coda.ValueType.String },
    group: { type: coda.ValueType.String },
    image: { 
      type: coda.ValueType.String, 
      codaType: coda.ValueHintType.ImageReference,
    },
  },
  displayProperty: "name",
  idProperty: "hexcode",
  featuredProperties: ["emoji", "group", "image"],
});

pack.addSyncTable({
  name: "Emojis",
  description: "Lists all of the emojis.",
  identityName: "Info",
  schema: EmojiSchema,
  formula: {
    name: "SyncEmojis",
    description: "Syncs the data.",
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "group",
        description: "If specified, only include emojis in this group.",
        optional: true,
        autocomplete: [
          "smileys-emotion", "people-body", "component", "animals-nature", 
          "food-drink", "travel-places", "activities", "objects", "symbols",
        ],
      }),
    ],
    execute: async function (args, context) {
      let [group] = args;
      let url = coda.withQueryParams("https://www.emoji.family/api/emojis", {
        group: group,
      });
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
      });
      let emojis = response.body;
      let rows = emojis.map(info => {
        return {
          // Start with all of the properties in the API response.
          ...info,
          image: `https://www.emoji.family/api/emojis/${info.emoji}/noto/png`,
        };
      });
      return {
        result: rows,
      };
    },
  },
});

pack.addNetworkDomain("emoji.family");

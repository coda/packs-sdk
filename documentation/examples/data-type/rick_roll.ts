import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Returns the infamous YouTube video by Rick Astley as an embed.
pack.addFormula({
  name: "Rickroll",
  description: "Embeds the video \"Never Gonna Give You Up\".",
  parameters: [],
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.Embed,
  execute: async function ([], context) {
    return "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
  },
});

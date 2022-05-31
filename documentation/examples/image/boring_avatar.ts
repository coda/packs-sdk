import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

pack.addNetworkDomain("source.boringavatars.com");

pack.addFormula({
  name: "BoringAvatar",
  description: "Get a boring avatar image.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "Size",
      description: "The size to generate the avatar in pixels.",
    }),
  ],
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.ImageAttachment,
  execute: async function ([size], context) {
    let resp = await context.fetcher.fetch({ 
      method: "GET", 
      url: `https://source.boringavatars.com/beam/${size}`,
    });
    // This API returns direct SVG code used to generate the avatar.
    let svg = resp.body;

    let url = await context.temporaryBlobStorage
                      .storeBlob(Buffer.from(svg), "image/svg+xml");
    return url;
  },
});

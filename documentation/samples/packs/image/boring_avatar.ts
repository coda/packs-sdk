import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

pack.addNetworkDomain("boringavatars.com");

pack.addFormula({
  name: "BoringAvatar",
  description: "Get a boring avatar image.",
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.Number,
      name: "size",
      description: "The size to generate the avatar in pixels.",
    }),
  ],
  resultType: sdk.ValueType.String,
  codaType: sdk.ValueHintType.ImageAttachment,
  execute: async function ([size], context) {
    let resp = await context.fetcher.fetch({
      method: "GET",
      url: `https://source.boringavatars.com/beam/${size}`,
      // Formats response as binary to get a Buffer of the svg data
      isBinaryResponse: true,
    });
    // This API returns direct SVG code used to generate the avatar.
    let svg = resp.body;

    let url = await context.temporaryBlobStorage
                      .storeBlob(svg, "image/svg+xml");
    return url;
  },
});

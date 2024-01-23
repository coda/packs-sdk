import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

pack.addFormula({
  name: "Upload",
  description: "Uploads an image to Imgur.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Image,
      name: "image",
      description: "The image to upload.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "title",
      description: "The title of the image.",
      optional: true,
    }),
  ],
  resultType: coda.ValueType.String,
  isAction: true,
  execute: async function (args, context) {
    let [imageUrl, title] = args;
    let response = await context.fetcher.fetch({
      method: "POST",
      url: "https://api.imgur.com/3/image",
      // Use the form field to generate a application/x-www-form-urlencoded
      // payload and set the correct headers.
      form: {
        image: imageUrl,
        type: "url",
        title: title,
      },
    });
    return response.body.data.link;
  },
});

pack.addNetworkDomain("imgur.com");

pack.setSystemAuthentication({
  type: coda.AuthenticationType.CustomHeaderToken,
  headerName: "Authentication",
  tokenPrefix: "Client-ID",
});

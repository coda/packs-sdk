import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Regular expression that matches Coda-hosted images.
const HostedImageUrlRegex = new RegExp("^https://(?:[^/]*\.)?codahosted.io/.*");

// Formula that calculates the file size of an image.
pack.addFormula({
  name: "FileSize",
  description: "Gets the file size of an image, in bytes.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Image,
      name: "image",
      description:
        "The image to operate on. Not compatible with Image URL columns.",
    }),
  ],
  resultType: coda.ValueType.Number,
  execute: async function ([imageUrl], context) {
    // Throw an error if the image isn't Coda-hosted. Image URL columns can
    // contain images on any domain, but by default Packs can only access image
    // attachments hosted on codahosted.io.
    if (!imageUrl.match(HostedImageUrlRegex)) {
      throw new coda.UserVisibleError("Not compatible with Image URL columns.");
    }
    // Fetch the image content.
    let response = await context.fetcher.fetch({
      method: "GET",
      url: imageUrl,
      isBinaryResponse: true, // Required when fetching binary content.
    });
    // The binary content of the response is returned as a Node.js Buffer.
    // See: https://nodejs.org/api/buffer.html
    let buffer = response.body as Buffer;
    // Return the length, in bytes.
    return buffer.length;
  },
});

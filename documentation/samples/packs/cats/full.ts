import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

pack.addNetworkDomain("cataas.com");

// Formula that fetches a random cat photo, with various options.
pack.addFormula({
  name: "CatPhoto",
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
      autocomplete: ["mono", "negate"],
      optional: true,
    }),
  ],
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.ImageReference,
  execute: async function (args, context) {
    let [text, size, color, width, height, filter] = args;
    let url = "https://cataas.com/cat";
    if (text) {
      url += "/says/" + encodeURIComponent(text);
    }
    url = coda.withQueryParams(url, {
      fontSize: size,
      fontColor: color,
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
    return response.body.url;
  },
});

// Column format that displays the cell's value within a random cat image,
// using the CatPhoto() formula defined above.
pack.addColumnFormat({
  name: "Cat Photo",
  instructions: "Displays the text over the photo of a random cat.",
  formulaName: "CatPhoto",
});

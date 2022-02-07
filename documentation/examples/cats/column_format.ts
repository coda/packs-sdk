import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Column format that displays the cell's value within a random cat image,
// using the CatImage() formula defined above.
pack.addColumnFormat({
  name: "Cat Image",
  instructions: "Displays the text over the image of a random cat.",
  formulaName: "CatImage",
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
    }),
  ],
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.ImageReference,
  execute: async function ([text], context) {
    let url = "https://cataas.com/cat/says/" + encodeURIComponent(text);
    url = coda.withQueryParams(url, {
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

// Allow the pack to make requests to Cat-as-a-service API.
pack.addNetworkDomain("cataas.com");

import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// Column format that displays the cell's value within a random cat image,
// using the CatPhoto() formula defined above.
pack.addColumnFormat({
  name: "Cat Photo",
  instructions: "Displays the text over the photo of a random cat.",
  formulaName: "CatPhoto",
});

// Formula that fetches a random cat photo, with various options.
pack.addFormula({
  name: "CatPhoto",
  description: "Gets a random cat image.",
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "text",
      description: "Text to display over the image.",
    }),
  ],
  resultType: sdk.ValueType.String,
  hintType: sdk.ValueHintType.ImageReference,
  execute: async function (args, context) {
    let [text] = args;
    let url = "https://cataas.com/cat/says/" + encodeURIComponent(text);
    url = sdk.withQueryParams(url, {
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

// Allow the pack to make requests to Cat-as-a-service API.
pack.addNetworkDomain("cataas.com");

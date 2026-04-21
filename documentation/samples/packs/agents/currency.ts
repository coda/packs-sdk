import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

pack.addSkill({
  name: "PlaceholderFiller",
  displayName: "Placeholder Filler",
  description:
    "Finds placeholders for currency values in the writing, and fills them in.",
  prompt: `
    Look for text like "$100 (or X CAD)" in the user's writing.
    Use the ExchangeRate tool to convert from one currency to another.
    Create a suggestion using the rewrite tool to replace the placeholder with
    the value.
  `,
  tools: [
    { type: sdk.ToolType.Pack },
    {
      type: sdk.ToolType.ScreenAnnotation,
      annotation: { type: sdk.ScreenAnnotationType.Rewrite },
    },
  ],
});

pack.addFormula({
  name: "ExchangeRate",
  description: "Gets the current exchange rate between two currencies.",
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "from",
      description: "The ISO 4217 country code to convert from.",
    }),
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "to",
      description: "The ISO 4217 country code to convert to.",
    }),
  ],
  resultType: sdk.ValueType.Number,
  execute: async function (args, context) {
    let [fromCountry, toCountry] = args;
    let response = await context.fetcher.fetch({
      method: "GET",
      url: `https://v6.exchangerate-api.com/v6/latest/${fromCountry}`,
    });
    // The JSON response is automatically parsed into an object.
    let rates = response.body.conversion_rates;
    let rate = rates[toCountry];
    if (!rate) {
      throw new sdk.UserVisibleError("Exchange rate not available.");
    }
    return rate;
  },
});

// Use the same API key for all users, passed in the Authorization header.
pack.setSystemAuthentication({
  type: sdk.AuthenticationType.HeaderBearerToken,
  instructionsUrl: "https://app.exchangerate-api.com/dashboard",
});

pack.addNetworkDomain("exchangerate-api.com");

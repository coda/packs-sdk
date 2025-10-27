import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

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
    { type: coda.ToolType.Pack },
    {
      type: coda.ToolType.ScreenAnnotation,
      annotation: { type: coda.ScreenAnnotationType.Rewrite },
    },
  ],
});

pack.addFormula({
  name: "ExchangeRate",
  description: "Gets the current exchange rate between two currencies.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "from",
      description: "The ISO 4217 country code to convert from.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "to",
      description: "The ISO 4217 country code to convert to.",
    }),
  ],
  resultType: coda.ValueType.Number,
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
      throw new coda.UserVisibleError("Exchange rate not available.");
    }
    return rate;
  },
});

// Use the same API key for all users, passed in the Authorization header.
pack.setSystemAuthentication({
  type: coda.AuthenticationType.HeaderBearerToken,
  instructionsUrl: "https://app.exchangerate-api.com/dashboard",
});

pack.addNetworkDomain("exchangerate-api.com");

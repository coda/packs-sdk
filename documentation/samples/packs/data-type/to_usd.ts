import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

pack.addNetworkDomain("exchangerate.host");

pack.addFormula({
  name: "ToUSD",
  description: "Convert from a different currency to US dollars.",
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.Number,
      name: "amount",
      description: "The amount to convert.",
    }),
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "from",
      description: "The currency to convert from.",
    }),
  ],
  resultType: sdk.ValueType.Number,
  schema: {
    type: sdk.ValueType.Number,
    hintType: sdk.ValueHintType.Currency,
    // Ensure the currency symbol displayed with the result is "$".
    currencyCode: "USD",
    // Only show two decimal places (no fractional pennies).
    precision: 2,
  },
  execute: async function ([amount, from], context) {
    let url = sdk.withQueryParams("https://api.exchangerate.host/latest", {
      base: from,
      amount: amount,
    });
    let response = await context.fetcher.fetch({
      method: "GET",
      url: url,
    });
    let rates = response.body.rates;
    return rates.USD;
  },
});

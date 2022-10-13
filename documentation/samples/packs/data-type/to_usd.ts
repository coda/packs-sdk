import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

pack.addNetworkDomain("exchangerate.host");

pack.addFormula({
  name: "ToUSD",
  description: "Convert from a different currency to US dollars.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "amount",
      description: "The amount to convert.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "from",
      description: "The currency to convert from.",
    }),
  ],
  resultType: coda.ValueType.Number,
  schema: {
    type: coda.ValueType.Number,
    codaType: coda.ValueHintType.Currency,
    // Ensure the currency symbol displayed with the result is "$".
    currencyCode: "USD",
    // Only show two decimal places (no fractional pennies).
    precision: 2,
  },
  execute: async function ([amount, from], context) {
    let url = coda.withQueryParams("https://api.exchangerate.host/latest", {
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

import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

pack.addFormula({
  name: "TotalCost",
  description: "Calculates the total cost for an order.",
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.SparseNumberArray,
      name: "prices",
      description: "The prices for each item.",
    }),
    sdk.makeParameter({
      type: sdk.ParameterType.SparseNumberArray,
      name: "quantities",
      description: "The quantities of each item. Default: 1.",
      optional: true,
    }),
    sdk.makeParameter({
      type: sdk.ParameterType.SparseNumberArray,
      name: "taxRates",
      description: "The tax rates for each item. Default: 0.",
      optional: true,
    }),
  ],
  resultType: sdk.ValueType.Number,
  hintType: sdk.ValueHintType.Currency,
  execute: async function ([prices, quantities=[], taxRates=[]], context) {
    if ((quantities.length > 0 && quantities.length !== prices.length) ||
        (taxRates.length > 0 && taxRates.length !== prices.length)) {
      throw new sdk.UserVisibleError("All lists must be the same length.");
    }
    let result = 0;
    for (let i = 0; i < prices.length; i++) {
      let price = prices[i];
      let quantity = quantities[i];
      let taxRate = taxRates[i];
      if (price == null) {
        // If the price is blank, continue on to the next row.
        continue;
      }
      if (quantity != null) {
        price *= quantity;
      }
      if (taxRate != null) {
        price += price * taxRate;
      }
      result += price;
    }
    return result;
  },
});

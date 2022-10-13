import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

pack.addFormula({
  name: "TotalCost",
  description: "Calculates the total cost for an order.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.SparseNumberArray,
      name: "prices",
      description: "The prices for each item.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.SparseNumberArray,
      name: "quantities",
      description: "The quantities of each item. Default: 1.",
      optional: true,
    }),
    coda.makeParameter({
      type: coda.ParameterType.SparseNumberArray,
      name: "taxRates",
      description: "The tax rates for each item. Default: 0.",
      optional: true,
    }),
  ],
  resultType: coda.ValueType.Number,
  codaType: coda.ValueHintType.Currency,
  execute: async function ([prices, quantities=[], taxRates=[]], context) {
    if ((quantities.length > 0 && quantities.length !== prices.length) ||
        (taxRates.length > 0 && taxRates.length !== prices.length)) {
      throw new coda.UserVisibleError("All lists must be the same length.");
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

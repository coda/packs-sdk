import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// Formula that converts slices of a pizza into a percentage eaten.
pack.addFormula({
  name: "PizzaEaten",
  description: "Calculates what percentage of a pizza was eaten.",
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.Number,
      name: "slices",
      description: "How many slices were eaten.",
    }),
  ],
  resultType: sdk.ValueType.Number,
  codaType: sdk.ValueHintType.Percent,
  execute: async function ([slices], context) {
    return slices / 8;
  },
});

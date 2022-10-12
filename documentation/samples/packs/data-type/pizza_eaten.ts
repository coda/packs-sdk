import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Formula that converts slices of a pizza into a percentage eaten.
pack.addFormula({
  name: "PizzaEaten",
  description: "Calculates what percentage of a pizza was eaten.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "slices",
      description: "How many slices were eaten.",
    }),
  ],
  resultType: coda.ValueType.Number,
  codaType: coda.ValueHintType.Percent,
  execute: async function ([slices], context) {
    return slices / 8;
  },
});

import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Generates a fictitious ice cream order, using a flexible set of choices.
pack.addFormula({
  name: "OrderIcecream",
  description: "Put in your ice cream order.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "scoops",
      description: "How many scoops do you want?",
    }),
  ],
  varargParameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "choice",
      description: "Which choice to set.",
      autocomplete: ["flavor", "topping", "vessel"],
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "value",
      description: "The value of that choice.",
      autocomplete: async function (context, search, params) {
        switch (params.choice) {
          case "flavor":
            return ["vanilla", "chocolate", "strawberry"];
          case "topping":
            return ["sprinkles", "whipped cream", "chocolate shell"];
          case "vessel":
            return ["cone", "cup"];
          default:
            return [];
        }
      },
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async function ([scoops, ...args], context) {
    let result = `${scoops}: scoops`;
    let choice, value;
    while (args.length > 0) {
      [choice, value, ...args] = args;
      result += `, ${choice}: ${value}`;
    }
    return result;
  },
});

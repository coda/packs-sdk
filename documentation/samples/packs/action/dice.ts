import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// Rolls virtual dice and returns the resulting numbers. Use it with a button in
// table and store the results in another column.
pack.addFormula({
  name: "RollDice",
  description: "Roll some virtual dice.",
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.Number,
      name: "quantity",
      description: "How many dice to roll.",
      suggestedValue: 1,
    }),
    sdk.makeParameter({
      type: sdk.ParameterType.Number,
      name: "sides",
      description: "How many sides the dice have.",
      suggestedValue: 6,
    }),
  ],
  resultType: sdk.ValueType.Array,
  items: sdk.makeSchema({
    type: sdk.ValueType.Number,
  }),
  isAction: true,
  execute: async function ([quantity, sides], context) {
    let results = [];
    for (let i = 0; i < quantity; i++) {
      let roll = Math.ceil(Math.random() * sides);
      results.push(roll);
    }
    return results;
  },
});

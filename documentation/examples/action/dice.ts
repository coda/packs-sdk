import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Rolls virtual dice and returns the resulting numbers. Use it with a button in
// table and store the results in another column.
pack.addFormula({
  name: "RollDice",
  description: "Roll some virtual dice.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "quantity",
      description: "How many dice to roll.",
      suggestedValue: 1,
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "sides",
      description: "How many sides the dice have.",
      suggestedValue: 6,
    }),
  ],
  resultType: coda.ValueType.Array,
  items: coda.makeSchema({
    type: coda.ValueType.Number,
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

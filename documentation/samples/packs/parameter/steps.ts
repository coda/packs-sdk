import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// Takes an unknown number of steps and labels and outputs a simple diagram.
// Example: Steps("Idea", "Experiment", "Prototype", "Refine", "Product")
// Result: Idea --Experiment--> Prototype --Refine--> Product
pack.addFormula({
  name: "Steps",
  description: "Draws a simple step diagram using text.",
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "start",
      description: "The starting step.",
    }),
  ],
  varargParameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "label",
      description: "The label for the arrow.",
    }),
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "step",
      description: "The next step.",
    }),
  ],
  resultType: sdk.ValueType.String,
  execute: async function ([start, ...varargs], context) {
    let result = start;
    while (varargs.length > 0) {
      let label; let step;
      // Pull the first set of varargs off the list, and leave the rest.
      [label, step, ...varargs] = varargs;
      result += ` --${label}--> ${step}`;
    }
    return result;
  },
});

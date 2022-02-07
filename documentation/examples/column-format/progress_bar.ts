import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Adds a column format to the Pack, which will display the contents of the
// column as a progress bar.
pack.addColumnFormat({
  name: "Progress Bar",
  instructions: "Draws a progress bar with the given percentage.",
  formulaName: "ProgressBar",
});

// Adds a formula to this Pack to draw a number as a progress bar. It is used by
// the column format above, but can also be used on it's own anywhere in the
// doc.
pack.addFormula({
  name: "ProgressBar",
  description: "Draws a progress bar.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "percentage",
      description: "The percentage complete, as a number between 0 and 1.",
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async function ([percentage], context) {
    if (percentage < 0 || percentage > 1) {
      throw new coda.UserVisibleError("Percentage must be between 0 and 1.");
    }
    let chars = Math.floor(percentage * 10);
    return "⬛".repeat(chars) + "⬜".repeat(10 - chars);
  },
});

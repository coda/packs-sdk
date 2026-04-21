import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// Adds a column format to the Pack, which will display the contents of the
// column in reverse order.
pack.addColumnFormat({
  name: "Reversed Text",
  instructions: "Whatever text you enter into this column will be reversed.",
  // The formula "Reverse()" (defined below) will be run on the content of the
  // column to determine its display value.
  formulaName: "Reverse",
});

// Adds a formula to this Pack to reverse text. It is used by the column format
// above, but can also be used on its own anywhere in the doc.
pack.addFormula({
  resultType: sdk.ValueType.String,
  name: "Reverse",
  description: "Reverses text.",
  parameters: [
    // Formulas used in column formats can have only one required parameter.
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "input",
      description: "The text to reverse.",
    }),
    // Optional parameters can't be set when run as a column format.
    sdk.makeParameter({
      type: sdk.ParameterType.Boolean,
      name: "byWord",
      description: "Reverse the text word-by-word.",
      suggestedValue: false,
      optional: true,
    }),
  ],
  execute: async function ([input, byWord = false]) {
    let separator = "";
    if (byWord) {
      separator = " ";
    }
    return input.split(separator).reverse().join(separator);
  },
});

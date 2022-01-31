import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Adds a column format to the Pack, which will display the contents of the
// column as Roman numerals.
pack.addColumnFormat({
  name: "Roman Numeral",
  instructions: "Displays the number as a Roman numeral.",
  formulaName: "RomanNumeral",
});

// Adds a formula to this Pack to convert a number to a Roman numeral. It is
// used by the column format above, but can also be used on it's own anywhere in
// the doc.
pack.addFormula({
  name: "RomanNumeral",
  description: "Converts a number to the equivalent Roman numeral.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "value",
      description: "The number to convert.",
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async function ([value], context) {
    let pairs = Object.entries(NumberMapping);
    // Sort the pairs by the number, largest to smallest.
    pairs.sort((a, b) => b[1] - a[1]);
    let result = "";
    for (let [roman, num] of pairs) {
      while (value >= num) {
        result += roman;
        value -= num;
      }
    }
    return result;
  },
});

const NumberMapping = {
  I: 1, IV: 4, V: 5, IX: 9, X: 10, XL: 40, L: 50, XC: 90, C: 100, CD: 400,
  D: 500, CM: 900, M: 1000,
};

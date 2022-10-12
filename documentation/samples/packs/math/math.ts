import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// A "numbers" parameter shared by both formulas.
const NumbersParameter = coda.makeParameter({
  type: coda.ParameterType.NumberArray,
  name: "numbers",
  description: "The numbers to perform the calculation on.",
});

pack.addFormula({
  name: "GCD",
  description: "Returns the greatest common divisor for a list of numbers.",
  parameters: [
    // Use the shared parameter created above.
    NumbersParameter,
  ],
  resultType: coda.ValueType.Number,
  execute: async function ([numbers]) {
    // Handle the error case where the list is empty.
    if (numbers.length === 0) {
      throw new coda.UserVisibleError("The list cannot be empty.");
    }

    // Handle the error case where all the numbers are zeros.
    if (numbers.every(number => number === 0)) {
      throw new coda.UserVisibleError(
        "The list must contain a non-zero number.");
    }

    let result = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
      let number = numbers[i];
      result = gcd(number, result);
    }
    return result;
  },
});

pack.addFormula({
  name: "LCM",
  description: "Returns the least common multiple for a list of numbers.",
  parameters: [
    // Use the shared parameter created above.
    NumbersParameter,
  ],
  resultType: coda.ValueType.Number,
  execute: async function ([numbers]) {
    // Handle the error case where the list is empty.
    if (numbers.length === 0) {
      throw new coda.UserVisibleError("The list cannot be empty.");
    }

    // Handle the error case where the list contains a zero.
    if (numbers.some(number => number === 0)) {
      throw new coda.UserVisibleError("The list must not contain a zero.");
    }

    let result = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
      let number = numbers[i];
      result = Math.abs(number * result) / gcd(number, result);
    }
    return result;
  },
});

// Helper function that calculates the greatest common divisor of two
// numbers.
function gcd(a, b) {
  if (a === 0) {
    return b;
  }
  return gcd(b % a, a);
}

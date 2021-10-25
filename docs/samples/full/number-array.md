---
title: Number Array
---

# Number Array sample

This is an example which creates two formulas that each take in an array of numbers and return the greatest common denominator and least common multiple.

=== "Number Array"
    ```ts
    // This import statement gives you access to all parts of the Coda Packs SDK.
    import * as coda from "@codahq/packs-sdk";

    // This import statement gives you access to all parts of the Coda Packs SDK.
    export const pack = coda.newPack();

    // We'll use an array of numbers in *both* formulas.
    const numberArray = coda.makeParameter({
      type: coda.ParameterType.NumberArray,
      name: "Numbers",
      description: "the numbers you want to calculate",
    });

    // We'll also use this helper function that finds the gcd of two numbers in
    // both formulas.
    function gcd(a, b) {
      if (a === 0) {
        return b;
      }
      return gcd(b % a, a);
    }

    // This line adds a new formula.
    pack.addFormula({
      // This is the name that will be called in the formula builder. Remember, your
      // formula name cannot have spaces in it.
      name: "GCD",
      description: "Returns the greatest common denominator for an array",

      // The needed array of numbers has already been defined above.
      parameters: [numberArray],

      // In this formula, we're returning a number in the Coda doc.
      resultType: coda.ValueType.Number,

      // Everything inside this execute statement will happen anytime your Coda
      // function is called in a doc. An array of all user inputs is always the 1st
      // parameter.
      execute: async function ([numberArray]) {
        let gcdResult = numberArray[0];

        for (let i = 1; i < numberArray.length; i++) {
          gcdResult = gcd(numberArray[i], gcdResult);

          if (gcdResult === 1) {
            return 1;
          }
        }
        return gcdResult;
      },
    });

    // Now, we'll define and add the second formula to the pack.
    pack.addFormula({
      name: "LCM",
      description: "Returns the least common multiple for an array",
      parameters: [numberArray],
      resultType: coda.ValueType.Number,
      execute: async function ([numberArray]) {
        let lcmResult = numberArray[0];

        for (let i = 1; i < numberArray.length; i++) {
          lcmResult = (numberArray[i] * lcmResult) / gcd(numberArray[i], lcmResult);
        }

        return lcmResult;
      },
    });
    ```

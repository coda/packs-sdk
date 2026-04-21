import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// Formula that adds five minutes to an input date and time.
pack.addFormula({
  name: "FiveMinsLate",
  description: "Adds five minutes to the input date and time.",
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.Date,
      name: "input",
      description: "The input date and time.",
    }),
  ],
  // Return the result as the number of seconds since the epoch.
  resultType: sdk.ValueType.Number,
  codaType: sdk.ValueHintType.Time,
  execute: async function ([input], context) {
    let seconds = input.getTime() / 1000;
    seconds += 5 * 60; // Add five minutes, as seconds.
    return seconds;
  },
});

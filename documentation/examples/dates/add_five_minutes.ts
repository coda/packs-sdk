import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Adds five minutes to a time value.
pack.addFormula({
  name: "AddFiveMinutes",
  description: "Add five minutes to a time.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Date,
      name: "time",
      description: "The input time.",
    }),
  ],
  // Always return a time as a number of seconds.
  resultType: coda.ValueType.Number,
  codaType: coda.ValueHintType.Time,
  execute: async function ([time], context) {
    let seconds = time.getTime() / 1000;
    seconds += 5 * 60; // Add five minutes, as seconds.
    return seconds;
  },
});

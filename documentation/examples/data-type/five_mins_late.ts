import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Formula that adds five minutes to an input date and time.
pack.addFormula({
  name: "FiveMinsLate",
  description: "Adds five minutes to the input date and time.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Date,
      name: "input",
      description: "The input date and time.",
    }),
  ],
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.DateTime,
  execute: async function ([input], context) {
    let result = new Date(input.getTime());
    result.setMinutes(result.getMinutes() + 5);
    return result.toISOString();
  },
});

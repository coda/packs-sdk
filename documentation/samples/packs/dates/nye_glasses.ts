import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

pack.addFormula({
  name: "GoodNYEGlasses",
  description: "Determines if a date is good for New Years Eve glasses " +
    "(the year contains two zeros).",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Date,
      name: "date",
      description: "The input date.",
    }),
  ],
  resultType: coda.ValueType.Boolean,
  execute: async function ([date], context) {
    // Format the JavaScript Date into a four-digit year.
    let formatted = date.toLocaleDateString("en", {
      timeZone: context.timezone, // Use the timezone of the doc (important!).
      year: "numeric",
    });
    // Extract all of the zeros from the year.
    let zeros = formatted.match(/0/g);
    return zeros?.length >= 2;
  },
});

import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

pack.addFormula({
  name: "SameDigit",
  description: "Determines if a date and time only contain a single digit." +
    "For example, 1/1/11 1:11.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Date,
      name: "dateAndTime",
      description: "The input date and time.",
    }),
  ],
  resultType: coda.ValueType.Boolean,
  execute: async function ([dateAndTime], context) {
    // Format the JavaScript Date to only include the monday, day, year, hour
    // and minute as numbers.
    let formatted = dateAndTime.toLocaleString("en-US", {
      timeZone: context.timezone, // Use the timezone of the doc (important!).
      month: "numeric",
      day: "numeric",
      year: "2-digit",
      hour: "numeric",
      minute: "numeric",
    });
    // Extract the digits from the formatted date.
    let digits = formatted.match(/\d/g);
    // Get the unique set of digits.
    let unique = new Set(digits);
    return unique.size === 1;
  },
});

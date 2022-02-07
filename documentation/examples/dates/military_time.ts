import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Displays a time using military conventions. The result is a string (text)
// value.
pack.addFormula({
  name: "ToMilitaryTime",
  description: "Displays a time in military time.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Date,
      name: "time",
      description: "The input time.",
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async function ([time], context) {
    // Format the JavaScript Date into 2-digit, 24 hour time.
    let formatted = time.toLocaleTimeString("en-US", {
      timeZone: context.timezone,  // Use the timezone of the doc (important!).
      hour12: false, // Use 24 hour time.
      hour: "2-digit",
      minute: "2-digit",
    });
    // Remove the colon separating the hours and minutes.
    formatted = formatted.replace(":", "");
    return formatted + " hours";
  },
});

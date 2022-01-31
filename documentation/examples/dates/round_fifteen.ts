import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Rounds a time to the nearest 15 minute mark. For example, 1:11 and 1:19 both
// round to 1:15.
pack.addFormula({
  name: "RoundTo15",
  description: "Rounds a time to the nearest 15 minute mark.",
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
    // Format the JavaScript Date into just a number of minutes.
    let formatted = time.toLocaleString("en-US", {
      timeZone: context.timezone, // Use the timezone of the doc (important!).
      minute: "numeric",
    });
    // Convert the minutes string into a number.
    let minutes = parseInt(formatted, 10);
    // Round the minutes to the nearest 15 minute mark.
    let nearest = (Math.round(minutes / 15) * 15);
    // Calculate the difference between the original and rounded.
    let diff = nearest - minutes;
    // Apply that difference to the original Date object. Because of timezones
    // DST you can't set the value directly.
    time.setMinutes(time.getMinutes() + diff);
    // Return the time as a number of seconds.
    return time.getTime() / 1000;
  }
});

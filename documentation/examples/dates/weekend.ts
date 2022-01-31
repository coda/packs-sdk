import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

pack.addFormula({
  name: "TheWeekend",
  description: "Determines when the nearest weekend starts (Friday @ 6PM).",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Date,
      name: "dateAndTime",
      description: "The input date and time.",
    }),
  ],
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.DateTime,
  execute: async function ([dateAndTime], context) {
    // Get the date as a string in the doc's timezone.
    // Use toLocaleDateString() to discard the time component.
    let formatted = dateAndTime.toLocaleDateString("en-US", {
      timeZone: context.timezone,
    });
    // Create a new Date object using that string. This allows us to work with
    // the date in a timezone-free context (UTC). This date is not the correct
    // moment in time, so never return it as a number.
    let temp = new Date(formatted);
    // If it's a Saturday or Sunday, it's already the weekend! Just return the
    // original date (with timezone).
    if (temp.getDay() === 0 || temp.getDay() === 6) {
      return dateAndTime.toString();
    }
    // Copy the date to calculate the weekend.
    let weekend = new Date(temp);
    // Calculate how many days until Friday.
    let diff = 5 - temp.getDay();
    // Shift the date by that many days.
    weekend.setDate(weekend.getDate() + diff);
    // Set the hour to 6PM.
    weekend.setHours(18);
    // Clear out the minutes, seconds, and milliseconds.
    weekend.setMinutes(0);
    weekend.setSeconds(0);
    weekend.setMilliseconds(0);
    // If the input date is greater than Friday at 6PM, it's already the
    // weekend! Just return the input date (with timezone).
    if (temp > weekend) {
      return dateAndTime.toString();
    }
    // Return a string version of the final date, without a timezone identifier.
    // Coda will interpret this string in the timezone of the document.
    // Use toLocaleString() to preserve the time component of the date.
    return weekend.toLocaleString();
  },
});

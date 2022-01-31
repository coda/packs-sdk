import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

pack.addFormula({
  name: "MondayOfWeek",
  description: "For a given date, returns the Monday of the that week.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Date,
      name: "date",
      description: "The input date.",
    }),
  ],
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.Date,
  execute: async function ([date], context) {
    // Get the date as a string in the doc's timezone.
    let formatted = date.toLocaleString("en-US", {
      timeZone: context.timezone, // Use the timezone of the doc (important!).
    });
    // Create a new Date object using that string. This allows us to work with
    // the date in a timezone-free context (UTC). This date is not the correct
    // moment in time, so never return it as a number.
    let temp = new Date(formatted);
    // Calculate how many days ago the Monday was.
    let day = temp.getDay();
    let delta = (day - 1 + 7) % 7;
    // Shift the date by that many days.
    temp.setDate(temp.getDate() - delta);
    // Return a string version of the final date, without a timezone identifier.
    // Coda will interpret this string in the timezone of the document.
    // Use toLocateDateString() to remove any time component left in the date.
    return temp.toLocaleDateString();
  }
});

import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Formula that adds a number of days to a date.
pack.addFormula({
  name: "OneWeekLater",
  description: "Get the date one week after the given date.",
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
    // Add seven days to the date.
    temp.setDate(temp.getDate() + 7);
    // Return a string version of the final date, without a timezone identifier.
    // Coda will interpret this string in the timezone of the document.
    // Use toLocateString() to preserve any time component left in the date.
    return temp.toLocaleString();
  },
});

import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Formula that gets the current weekday, for example "Monday".
pack.addFormula({
  name: "CurrentWeekday",
  description: "Get the current day of the week.",
  parameters: [],
  resultType: coda.ValueType.String,
  execute: async function ([], context) {
    let now = new Date();
    let formatter = Intl.DateTimeFormat("us-US", {
      timeZone: context.timezone,
      weekday: "long",
    });
    return formatter.format(now);
  },
});

import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// Formula that gets the current weekday, for example "Monday".
pack.addFormula({
  name: "CurrentWeekday",
  description: "Get the current day of the week.",
  parameters: [],
  resultType: sdk.ValueType.String,
  execute: async function ([], context) {
    let now = new Date();
    let formatter = Intl.DateTimeFormat("us-US", {
      timeZone: context.timezone,
      weekday: "long",
    });
    return formatter.format(now);
  },
});

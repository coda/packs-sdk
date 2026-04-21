/* eslint-disable @typescript-eslint/no-unused-vars */
// BEGIN
import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// Define a schema for the information about the daylight at a given location.
const SunSchema = sdk.makeObjectSchema({
  properties: {
    daylight: {
      description: "How much daylight there will be.",
      type: sdk.ValueType.String,
      codaType: sdk.ValueHintType.Duration,
    },
    sunriseUTC: {
      description: "When the sun will rise (in UTC).",
      type: sdk.ValueType.String,
      codaType: sdk.ValueHintType.Time,
    },
    sunsetUTC: {
      description: "When the sun will set (in UTC).",
      type: sdk.ValueType.String,
      codaType: sdk.ValueHintType.Time,
    },
  },
  // Which of the properties defined above will be shown inside the chip.
  displayProperty: "daylight",
});

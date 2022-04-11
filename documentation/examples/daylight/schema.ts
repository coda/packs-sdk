/* eslint-disable @typescript-eslint/no-unused-vars */
// BEGIN
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Define a schema for the information about the daylight at a given location.
const SunSchema = coda.makeObjectSchema({
  properties: {
    daylight: {
      description: "How much daylight there will be.",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Duration,
    },
    sunriseUTC: {
      description: "When the sun will rise (in UTC).",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Time,
    },
    sunsetUTC: {
      description: "When the sun will set (in UTC).",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Time,
    },
  },
  // Which of the properties defined above will be shown inside the chip.
  displayProperty: "daylight",
});

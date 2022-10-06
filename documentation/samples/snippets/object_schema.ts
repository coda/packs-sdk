import * as coda from "@codahq/packs-sdk";

// BEGIN

const MySchema = coda.makeObjectSchema({
  properties: {
    property1: { type: coda.ValueType.String },
    property2: { type: coda.ValueType.Number },
    // Add more properties here.
  },
  displayProperty: "property1", // Which property above to display by default.
});

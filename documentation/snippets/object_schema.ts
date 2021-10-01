import * as coda from "@codahq/packs-sdk";

// BEGIN

const MySchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  properties: {
    property1: {type: coda.ValueType.Number},
    property2: {type: coda.ValueType.String},
    // Add more properties here.
  },
  id: "property1", // Which property above is a unique ID.
  primary: "property2", // Which property above to display by default.
  identity: {
    name: "<User-visible name of the schema>",
  },
});

import * as coda from "@codahq/packs-sdk";

const pack = coda.newPack();

// BEGIN

const MySchema = coda.makeObjectSchema({
  properties: {
    property1: { type: coda.ValueType.Number },
    property2: { type: coda.ValueType.String },
    // Add more properties here.
  },
  idProperty: "property1", // Which property above is a unique ID.
  displayProperty: "property2", // Which property above to display by default.
  identity: {
    name: "<User-visible name>",
  },
});

pack.addFormula({
  name: "<User-visible name of formula>",
  description: "<Help text for the formula>",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "<User-visible name of parameter>",
      description: "<Help text for the parameter>",
    }),
    // Add more parameters here and in the array below.
  ],
  resultType: coda.ValueType.Object,
  schema: MySchema,
  execute: async function ([param], context) {
    return {
      property1: 123,
      property2: param,
    };
  },
});

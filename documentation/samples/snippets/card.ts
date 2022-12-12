import * as coda from "@codahq/packs-sdk";

const pack = coda.newPack();

// BEGIN

// A schema that defines the data shown in the card.
const MyCardSchema = coda.makeObjectSchema({
  properties: {
    property1: { type: coda.ValueType.String },
    property2: { type: coda.ValueType.Number },
    // Add more properties here.
  },
  displayProperty: "<Property name>", // Display value shown in mention chip.
  titleProperty: "<Property name>", // Title of the card.
  subtitleProperties: [
    // Properties shown in the subtitle of the card.
    "<Property name>",
    { property: "<Property name>", label: "" }, // Show the value only.
    // Add more subtitle properties here.
  ],
  snippetProperty: "<Property name>", // Content shown in the card body
  imageProperty: "<Property name>", // Image shown on the card.
  linkProperty: "<Property name>", // Link opened when the card is clicked.
});

// A formula that accepts a URL and returns an object matching the schema above.
pack.addFormula({
  name: "<User-visible name of formula>",
  description: "<Help text for the formula>",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "url",
      description: "<Help text for the parameter>",
    }),
    // Add more parameters here and in the array below.
  ],
  resultType: coda.ValueType.Object,
  schema: MyCardSchema,
  execute: async function ([url], context) {
    // TODO: Fetch information about the item represented by the URL.
    return {
      // TODO: Populate with fetched information.
      link: url,
    };
  },
});

// A column format that defines which URL patterns the formula should match.
pack.addColumnFormat({
  name: "<User-visible name>",
  instructions: "<Help text for the format>",
  formulaName: "<Name of the formula above>",
  matchers: [
    new RegExp("<Regular expression that matches the URLs>"),
    // Add more URL patterns here.
  ],
});

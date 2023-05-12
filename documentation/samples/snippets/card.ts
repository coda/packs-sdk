/* eslint-disable @typescript-eslint/no-unused-vars */
import * as coda from "@codahq/packs-sdk";

const pack = coda.newPack();

const $1Schema = undefined;

// BEGIN

// A schema that defines the data shown in the card.
const $1$Thing$Schema = coda.makeObjectSchema({
  properties: {
    $2$name$: { type: coda.ValueType.String },
    $3$description$: { type: coda.ValueType.String },
    $4$picture$: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.ImageReference,
    },
    $5$link$: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
    },
    // TODO: Add more properties.
  },
  displayProperty: "$2",
  titleProperty: "$2",
  snippetProperty: "$3",
  imageProperty: "$4",
  linkProperty: "$5",
  subtitleProperties: [
    // TODO: List the properties to show under the title.
  ],
});

// A formula that accepts a URL and returns an object matching the schema above.
pack.addFormula({
  name: "$1",
  description: "${6:My description.}",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "url",
      description: "${6: My parameter description.}",
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: $1Schema,
  execute: async function (args, context) {
    let [url] = args;
    // TODO: Fetch information about the item represented by the URL.
    return {
      // TODO: Populate with fetched information.
      $5: url,
    };
  },
});

// A column format that defines which URL patterns the formula should match.
pack.addColumnFormat({
  name: "$1",
  instructions: "${7:My instructions.}",
  formulaName: "$1",
  matchers: [
    new RegExp("${8:https://example.com/.*}"),
    // TODO: Optionally add more URL patterns.
  ],
});

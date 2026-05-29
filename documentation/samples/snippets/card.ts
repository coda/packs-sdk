/* eslint-disable @typescript-eslint/no-unused-vars */
import * as sdk from "@codahq/packs-sdk";

const pack = sdk.newPack();

const $1Schema = undefined;

// BEGIN

// A schema that defines the data shown in the card.
const $1$Thing$Schema = sdk.makeObjectSchema({
  properties: {
    $2$name$: { type: sdk.ValueType.String },
    $3$description$: { type: sdk.ValueType.String },
    $4$picture$: {
      type: sdk.ValueType.String,
      hintType: sdk.ValueHintType.ImageReference,
    },
    $5$link$: {
      type: sdk.ValueType.String,
      hintType: sdk.ValueHintType.Url,
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
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "url",
      description: "${6: My parameter description.}",
    }),
  ],
  resultType: sdk.ValueType.Object,
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

/* eslint-disable @typescript-eslint/no-unused-vars */
import * as sdk from "@codahq/packs-sdk";

// BEGIN

const $1$Thing$Schema = sdk.makeObjectSchema({
  properties: {
    $2$name$: { type: sdk.ValueType.String },
    $3$description$: { type: sdk.ValueType.String },
    $4$picture$: {
      type: sdk.ValueType.String,
      codaType: sdk.ValueHintType.ImageReference,
    },
    $5$link$: {
      type: sdk.ValueType.String,
      codaType: sdk.ValueHintType.Url,
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

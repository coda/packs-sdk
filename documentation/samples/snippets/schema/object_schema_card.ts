/* eslint-disable @typescript-eslint/no-unused-vars */
import * as coda from "@codahq/packs-sdk";

// BEGIN

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

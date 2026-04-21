/* eslint-disable @typescript-eslint/no-unused-vars */
import * as sdk from "@codahq/packs-sdk";

// BEGIN

const $1$Thing$Schema = sdk.makeObjectSchema({
  properties: {
    $2$name$: { type: sdk.ValueType.String },
    $3$id$: { type: sdk.ValueType.String },
    // TODO: Add more properties.
  },
  displayProperty: "$2",
  idProperty: "$3",
  featuredProperties: [
    // TODO: Add featured properties.
  ],
});

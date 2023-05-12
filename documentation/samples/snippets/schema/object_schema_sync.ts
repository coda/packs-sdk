/* eslint-disable @typescript-eslint/no-unused-vars */
import * as coda from "@codahq/packs-sdk";

// BEGIN

const $1$Thing$Schema = coda.makeObjectSchema({
  properties: {
    $2$name$: { type: coda.ValueType.String },
    $3$thingId$: { type: coda.ValueType.String },
    // TODO: Add more properties.
  },
  displayProperty: "$2",
  idProperty: "$3",
  featuredProperties: [
    // TODO: Add featured properties.
  ],
});

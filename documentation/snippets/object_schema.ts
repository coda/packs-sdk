import * as coda from '@codahq/packs-sdk';

// BEGIN
coda.makeObjectSchema({
  type: coda.ValueType.Object,
  id: '<objectId>',
  primary: '<displayName>',
  properties: {
    // objectId: {type: coda.ValueType.Number},
    // displayName: {type: coda.ValueType.String},
  },
});

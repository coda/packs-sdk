import * as coda from '../../index';

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

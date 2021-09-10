import * as coda from '@codahq/packs-sdk';

// BEGIN

coda.makeParameter({
  type: coda.ParameterType.Number,
  name: 'myParam',
  description: 'My description',
});

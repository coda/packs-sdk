import * as coda from '@codahq/packs-sdk';

// BEGIN

coda.makeParameter({
  type: coda.ParameterType.Boolean,
  name: 'myParam',
  description: 'My description',
});

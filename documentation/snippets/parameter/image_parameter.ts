import * as coda from '@codahq/packs-sdk';

// BEGIN

coda.makeParameter({
  type: coda.ParameterType.Image,
  name: 'myParam',
  description: 'My description',
});

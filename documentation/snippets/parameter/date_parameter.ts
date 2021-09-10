import * as coda from '@codahq/packs-sdk';

// BEGIN

coda.makeParameter({
  type: coda.ParameterType.Date,
  name: 'myParam',
  description: 'My description',
});

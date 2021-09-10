import * as coda from '@codahq/packs-sdk';

// BEGIN

coda.makeParameter({
  type: coda.ParameterType.Html,
  name: 'myParam',
  description: 'My description',
});

import * as coda from '../../../index';

const pack = coda.newPack();

// BEGIN

pack.setSystemAuthentication({
  // Replace HeaderBearerToken with an authentication type.
  // (Not all authentication types are available for system authentication.)
  type: coda.AuthenticationType.HeaderBearerToken,
});

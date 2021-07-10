import * as coda from '../../index';

const pack = coda.newPack();

// BEGIN

pack.setSystemAuthentication({
  type: coda.AuthenticationType.HeaderBearerToken,
});

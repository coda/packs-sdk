import * as coda from '../../index';

const pack = coda.newPack();

// BEGIN

pack.setUserAuthentication({
  type: coda.AuthenticationType.None,
});

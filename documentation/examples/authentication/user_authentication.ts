import * as coda from '../../../index';

const pack = coda.newPack();

// BEGIN

pack.setUserAuthentication({
  // Replace None with the authentication type that applies for your connection.
  type: coda.AuthenticationType.None,
});

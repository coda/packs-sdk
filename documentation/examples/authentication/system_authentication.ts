import * as coda from '../../../index';

const pack = coda.newPack();

// BEGIN

pack.setSystemAuthentication({
  // Replace HeaderBearerToken with an authentication type
  // besides OAuth2, CodaApiHeaderBearerToken, None and Various.
  type: coda.AuthenticationType.HeaderBearerToken,
});

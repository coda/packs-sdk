import * as coda from "@codahq/packs-sdk";

const pack = coda.newPack();

// BEGIN

pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2ClientCredentials,
  // The following URL will be found in the API's documentation.
  tokenUrl: "${1:https://example.com/token}",
});

import * as sdk from "@codahq/packs-sdk";

const pack = sdk.newPack();

// BEGIN

pack.setUserAuthentication({
  type: sdk.AuthenticationType.OAuth2ClientCredentials,
  // The following URL will be found in the API's documentation.
  tokenUrl: "${1:https://example.com/token}",
});

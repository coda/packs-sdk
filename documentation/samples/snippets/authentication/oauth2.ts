import * as coda from "@codahq/packs-sdk";

const pack = coda.newPack();

// BEGIN

// When registering your app in the API's developer console set the redirect URL
// to: https://coda.io/packsAuth/oauth2/{PACK ID}
// After building your Pack, remember to visit the Settings tab to set your
// client ID and secret.
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  // The following two URLs are will be found in the API's documentation.
  authorizationUrl: "<Authorization URL>",
  tokenUrl: "<Token URL>",
});


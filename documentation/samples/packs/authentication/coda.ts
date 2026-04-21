import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// Per-user authentication to the Coda API, using a token in the Authorization
// header.
// See https://coda.io/developers/apis/v1
pack.setUserAuthentication({
  type: sdk.AuthenticationType.CodaApiHeaderBearerToken,

  // Creates the token automatically when the Pack is installed.
  shouldAutoAuthSetup: true,
});

// Allow the pack to make requests to Coda.
pack.addNetworkDomain("coda.io");

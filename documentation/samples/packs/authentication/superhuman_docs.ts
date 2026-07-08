import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// Per-user authentication to the Superhuman Docs API, using a token in the
// Authorization header.
// See https://docs.superhuman.com/developers/apis/v1
pack.setUserAuthentication({
  type: sdk.AuthenticationType.CodaApiHeaderBearerToken,

  // Creates the token automatically when the Pack is installed.
  shouldAutoAuthSetup: true,
});

// Allow the pack to make requests to Superhuman Docs.
pack.addNetworkDomain("docs.superhuman.com");
